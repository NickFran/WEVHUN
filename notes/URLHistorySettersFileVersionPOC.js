import { useBrowserStore } from './store_browser';

export const navigate = (newUrl) => {
  const { URLHistoryStack, URLHistoryStackPointer } = useBrowserStore.getState();
  
  // 1. Truncate forward history
  const activeHistory = URLHistoryStack.slice(0, URLHistoryStackPointer + 1);
  const updatedStack = [...activeHistory, newUrl];

  // 2. Update store directly
  useBrowserStore.setState({
    URL: newUrl,
    URLHistoryStack: updatedStack,
    URLHistoryStackPointer: updatedStack.length - 1,
  });
};

export const goBack = () => {
  const { URLHistoryStack, URLHistoryStackPointer } = useBrowserStore.getState();
  if (URLHistoryStackPointer <= 0) return;

  const prevPointer = URLHistoryStackPointer - 1;
  useBrowserStore.setState({
    URLHistoryStackPointer: prevPointer,
    URL: URLHistoryStack[prevPointer],
  });
};

export const goForward = () => {
  const { URLHistoryStack, URLHistoryStackPointer } = useBrowserStore.getState();
  if (URLHistoryStackPointer >= URLHistoryStack.length - 1) return;

  const nextPointer = URLHistoryStackPointer + 1;
  useBrowserStore.setState({
    URLHistoryStackPointer: nextPointer,
    URL: URLHistoryStack[nextPointer],
  });
};