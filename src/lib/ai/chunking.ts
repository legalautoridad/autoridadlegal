/**
 * Utility to split large text into smaller chunks for RAG.
 */
export function chunkText(
    text: string,
    maxChunkSize: number = 1000,
    overlap: number = 200
): string[] {
    if (!text || text.length === 0) return [];

    // Clean text: normalize whitespace
    const cleanText = text.replace(/\s+/g, ' ').trim();

    if (cleanText.length <= maxChunkSize) {
        return [cleanText];
    }

    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < cleanText.length) {
        let endIndex = startIndex + maxChunkSize;

        // If we are not at the end, try to find a better breaking point (paragraph or sentence)
        if (endIndex < cleanText.length) {
            // Priority 1: Paragraph break (two newlines or more - though we normalized bits, let's look for period + space)
            // Priority 2: Sentence break (period, exclamation, question mark + space)
            // Priority 3: Word break (space)

            const searchRange = cleanText.substring(Math.max(startIndex, endIndex - 200), endIndex);
            const lastPeriod = searchRange.lastIndexOf('.');
            const lastExclamation = searchRange.lastIndexOf('!');
            const lastQuestion = searchRange.lastIndexOf('?');
            const lastSpace = searchRange.lastIndexOf(' ');

            const bestBreakInSearchRange = Math.max(lastPeriod, lastExclamation, lastQuestion);

            if (bestBreakInSearchRange !== -1) {
                // Adjust endIndex to the punctuation
                endIndex = Math.max(startIndex, endIndex - 200) + bestBreakInSearchRange + 1;
            } else if (lastSpace !== -1) {
                // Adjust to last space
                endIndex = Math.max(startIndex, endIndex - 200) + lastSpace;
            }
        }

        const chunk = cleanText.substring(startIndex, endIndex).trim();
        if (chunk) chunks.push(chunk);

        // Move startIndex forward, but subtract the overlap
        startIndex = endIndex - overlap;

        // Safety break to prevent infinite loops if overlap is too large or progress is zero
        if (startIndex >= cleanText.length || endIndex >= cleanText.length) break;
        if (startIndex < 0) startIndex = 0;

        // If we didn't actually move forward, force progress
        const lastChunkIndex = chunks.length > 0 ? cleanText.indexOf(chunks[chunks.length - 1]) : -1;
        if (startIndex <= lastChunkIndex) {
            startIndex = endIndex; // Force leap to next chunk if overlap is stuck
        }
    }

    return chunks;
}
