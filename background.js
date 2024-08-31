chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'add-to-group',
    title: 'Add to current Group',
    contexts: ['link']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'add-to-group') {
    const linkUrl = info.linkUrl;
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      
      chrome.tabGroups.query({ windowId: currentTab.windowId}, (groups) => {
        let group=groups.filter( a => a.id==currentTab.groupId );
        if (group.length === 0) {
            chrome.tabs.create({ url: linkUrl, index: currentTab.index + 1 }, (newTab) => {
              chrome.tabs.group({
                tabIds: [newTab.id,currentTab.id]
              },(gx) =>{ chrome.tabGroups.update(gx, { title: currentTab.title.split(' ')[0] })}
              );
            
            
            });
        } else {
        
          chrome.tabs.create({ url: linkUrl, index: currentTab.index + 1 }, (newTab) => {
            chrome.tabs.group({
              tabIds: [newTab.id],
              groupId: group[0].id
            });
          });
        }
      });
    });
  }
});
