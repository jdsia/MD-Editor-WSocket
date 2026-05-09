
// takes a function and delay time, returns a new function that only executes after delay ms of inactivity
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>
  
    return (...args: Parameters<T>) => {
      // Clear any existing timeout
        clearTimeout(timeoutId)
    
        // Set a new timeout
        timeoutId = setTimeout(() => {
          func(...args)
        }, delay)
    }

}