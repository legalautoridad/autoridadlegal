import fs from 'fs';
import path from 'path';

export interface GitHubTreeItem {
    path: string;
    mode: string;
    type: 'blob' | 'tree';
    sha: string;
    size?: number;
    url: string;
}

export class OKFGitHubClient {
    private token: string;
    private owner: string;
    private repo: string;
    private branch: string;
    private localFallbackPath: string;
    private preferLocal: boolean;

    constructor() {
        this.token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || '';
        this.owner = process.env.OKF_REPO_OWNER || 'legalautoridad';
        this.repo = process.env.OKF_REPO_NAME || 'OKF_AL';
        this.branch = process.env.OKF_REPO_BRANCH || 'main';
        this.localFallbackPath = '/Users/domingoimperatori/Documents/OKF_AL';
        this.preferLocal = process.env.USE_LOCAL_OKF === 'true';
    }

    /**
     * Checks if local OKF repository folder exists.
     */
    public hasLocalRepository(): boolean {
        return fs.existsSync(this.localFallbackPath) && fs.existsSync(path.join(this.localFallbackPath, 'servicios'));
    }

    /**
     * Fetches entire Git tree recursively from GitHub API in 1 request.
     */
    public async getGitTree(): Promise<GitHubTreeItem[]> {
        if (this.preferLocal && this.hasLocalRepository()) {
            return this.getLocalTree();
        }

        try {
            const apiUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/git/trees/${this.branch}?recursive=1`;
            const headers: Record<string, string> = {
                'User-Agent': 'AutoridadLegal-App',
                'Accept': 'application/vnd.github.v3+json',
            };

            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }

            const res = await fetch(apiUrl, { headers });
            if (!res.ok) {
                throw new Error(`GitHub API error ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            return data.tree || [];
        } catch (err: any) {
            console.warn(`⚠️ GitHub API tree fetch failed (${err.message}). Falling back to local repository if available.`);
            if (this.hasLocalRepository()) {
                return this.getLocalTree();
            }
            throw err;
        }
    }

    /**
     * Reads file content from GitHub API or local disk fallback.
     */
    public async getFileContent(relativePath: string): Promise<string> {
        // If local is explicitly preferred, read local first
        if (this.preferLocal && this.hasLocalRepository()) {
            const localFilePath = path.join(this.localFallbackPath, relativePath);
            if (fs.existsSync(localFilePath)) {
                return fs.readFileSync(localFilePath, 'utf-8');
            }
        }

        // Try GitHub API
        try {
            const apiUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${relativePath}?ref=${this.branch}`;
            const headers: Record<string, string> = {
                'User-Agent': 'AutoridadLegal-App',
                'Accept': 'application/vnd.github.v3.raw',
            };

            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }

            const res = await fetch(apiUrl, { headers });
            if (!res.ok) {
                throw new Error(`GitHub API error ${res.status}: ${res.statusText}`);
            }

            return await res.text();
        } catch (err: any) {
            // Fallback to local disk if API fails
            if (this.hasLocalRepository()) {
                const localFilePath = path.join(this.localFallbackPath, relativePath);
                if (fs.existsSync(localFilePath)) {
                    return fs.readFileSync(localFilePath, 'utf-8');
                }
            }
            throw err;
        }
    }

    /**
     * Lists directory contents from GitHub API or local disk.
     */
    public async listDirectory(relativePath: string): Promise<string[]> {
        if (this.preferLocal && this.hasLocalRepository()) {
            const localDirPath = path.join(this.localFallbackPath, relativePath);
            if (fs.existsSync(localDirPath)) {
                return fs.readdirSync(localDirPath);
            }
        }

        try {
            const apiUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${relativePath}?ref=${this.branch}`;
            const headers: Record<string, string> = {
                'User-Agent': 'AutoridadLegal-App',
                'Accept': 'application/vnd.github.v3+json',
            };

            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }

            const res = await fetch(apiUrl, { headers });
            if (!res.ok) {
                throw new Error(`GitHub API error ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            if (Array.isArray(data)) {
                return data.map((item: any) => item.name);
            }
            return [];
        } catch (err: any) {
            if (this.hasLocalRepository()) {
                const localDirPath = path.join(this.localFallbackPath, relativePath);
                if (fs.existsSync(localDirPath)) {
                    return fs.readdirSync(localDirPath);
                }
            }
            throw err;
        }
    }

    /**
     * Builds tree representation from local disk repository.
     */
    private getLocalTree(): GitHubTreeItem[] {
        const items: GitHubTreeItem[] = [];

        const walk = (dir: string, prefix = '') => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                if (file.startsWith('.')) continue;
                const fullPath = path.join(dir, file);
                const relPath = prefix ? `${prefix}/${file}` : file;
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    items.push({ path: relPath, mode: '040000', type: 'tree', sha: '', url: '' });
                    walk(fullPath, relPath);
                } else {
                    items.push({ path: relPath, mode: '100644', type: 'blob', sha: '', size: stat.size, url: '' });
                }
            }
        };

        walk(this.localFallbackPath);
        return items;
    }
}
