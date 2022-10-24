const RECENT_FILES_STORAGE_KEY = 'rs';

interface RecentFile {
    path: string
    lastEdit: number
}

export function getRecentFiles(): Array<RecentFile> {
    const array = localStorage.getItem(RECENT_FILES_STORAGE_KEY)
    if(!array) return []

    return JSON.parse(array)
}

export function addToRecentFiles(recentFile: RecentFile) {
    const recentFiles = getRecentFiles().filter(it => it.path!==recentFile.path);
    if (recentFiles.length >= 10) recentFiles.pop();


    localStorage.setItem(RECENT_FILES_STORAGE_KEY, JSON.stringify([recentFile, ...recentFiles]))
}