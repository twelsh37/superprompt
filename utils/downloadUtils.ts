/**
 * Utility function to download text content as a file
 * @param text - The text content to download
 * @param filename - The name of the file to be downloaded
 */
const downloadTextAsFile = (text: string, filename: string = 'prompt.txt') => {
  // Create a blob with the text content
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  
  // Create a temporary URL for the blob
  const url = window.URL.createObjectURL(blob);
  
  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Gets text content from a specific selector and downloads it
 * @param selector - The CSS selector for the target element
 * @param filename - Optional filename for the download
 * @returns object with success status and text content
 */
export const downloadTextFromElement = (
  selector: string,
  filename: string = 'prompt.txt'
): { success: boolean; content: string } => {
  try {
    const element = document.querySelector(selector);
    if (!element) {
      console.error('Element not found:', selector);
      return { success: false, content: '' };
    }

    const text = element.textContent || '';
    if (!text.trim()) {
      console.error('No text content found in element');
      return { success: false, content: '' };
    }

    downloadTextAsFile(text.trim(), filename);
    return { success: true, content: text.trim() };
  } catch (error) {
    console.error('Error downloading text:', error);
    return { success: false, content: '' };
  }
};

/**
 * Gets text content from code element within the specified TypeScript section
 */
export const downloadTypeScriptPrompt = () => {
  const selector = '#TypeScript > div > div:nth-child(1) > div.bg-card.h-full.mb-2.font-mono.p-4.pr-1.text-sm.opacity-50.hover\\:opacity-100.transition-opacity.group.relative.flex-grow > a > div > code';
  return downloadTextFromElement(selector, 'typescript-prompt.txt');
}; 
