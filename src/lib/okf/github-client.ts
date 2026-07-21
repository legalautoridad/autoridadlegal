import fs from 'fs';
import path from 'path';

export interface GitHubFile {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: 'file' | 'dir';
}

export class OKFGitHubClient {
    private token: string;
    private owner: string;
    private repo: string;
    private branch: string;
    private localFallbackPath: string;

    constructor() {
        this.token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || '';
        this.owner = process.env.OKF_REPO_OWNER || 'legalautoridad';
        this.repo = process.env.OKF_REPO_NAME || 'OKF_AL';
        this.branch = process.env.OKF_REPO_BRANCH || 'main';
        this.localFallbackPath = '/Users/domingoimperatori/Documents/OKF_AL';
    }

    /**
     * Checks if local OKF repository folder exists.
     */
    public hasLocalRepository(): boolean {
        return fs.existsSync(this.localFallbackPath) && fs.existsSync(path.join(this.localFallbackPath, 'servicios'));
    }

    /**
     * Reads file content either from local disk or GitHub API.
     */
    public async getFileContent(relativePath: string): Promise<string> {
        // Try local disk first if available
        if (this.hasLocalRepository()) {
            const localFilePath = path.join(this.localFallbackPath, relativePath);
            if (fs.existsSync(localFilePath)) {
                return fs.readFileSync(localFilePath, 'utf-8');
            }
        }

        // Fallback to GitHub API
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
            throw new Error(`Failed to fetch file from GitHub (${relativePath}): ${res.status} ${res.statusText}`);
        }

        return await res.text();
    }

    /**
     * Lists directory contents from local disk or GitHub API.
     */
    public async listDirectory(relativePath: string): Promise<string[]> {
        if (this.hasLocalRepository()) {
            const localDirPath = path.join(this.localFallbackPath, relativePath);
            if (fs.existsSync(localDirPath)) {
                return fs.readdirSync(localDirPath);
            }
        }

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
            throw new Error(`Failed to list directory from GitHub (${relativePath}): ${res.status} ${res.statusText}`);
        }

        const data: GitHubFile[] = await res.json();
        return data.map(item => item.name);
    }
}
