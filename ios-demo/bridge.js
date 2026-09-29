(() => {
  if (location.hostname !== 'stillwell-vip-demo.onrender.com') return;
  const style = document.createElement('style');
  style.textContent = window.stillwellMobileCSS;
  document.head.append(style);
  document.documentElement.classList.add('ios-demo');
  const send = payload => window.webkit.messageHandlers.stillwell.postMessage(payload);
  const route = () => {
    document.documentElement.dataset.route = location.hash.slice(1) || 'overview';
    send({action:'route',route:location.hash.slice(1) || 'overview'});
  };
  window.addEventListener('hashchange', route);
  route();
  const appWording = root => {
    const labels = new Map([
      ['Saved in this browser as you type.', 'Saved in this app as you type.'],
      ['Corrections change your saved values, not the original extracted quotes. The original file is available only during this browser session; saved text stays in this browser.', 'Corrections change your saved values, not the original extracted quotes. The original file is available only during this app session; saved text stays in this app.'],
      ['Saved demo data stays in this browser. In live mode, selected records and messages are sent through the server to OpenAI. No clinical service is connected.', 'Saved demo data stays in this app. In live mode, selected records and messages are sent through the server to OpenAI. No clinical service is connected.']
    ]);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement?.closest('script,style,textarea,pre,input')) continue;
      const updated = labels.get(node.data);
      if (updated) node.data = updated;
    }
  };
  appWording(document.body);
  new MutationObserver(changes => {
    for (const change of changes) for (const node of change.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) appWording(node);
      else if (node.nodeType === Node.TEXT_NODE && node.parentElement) appWording(node.parentElement);
    }
  }).observe(document.body, {childList:true, subtree:true});
  // Observe the rendered product rather than assuming navigation completion means it is ready.
  const ready = () => {
    if (!document.querySelector('#app .page')) return false;
    send({action:'ready'});
    return true;
  };
  if (!ready()) {
    const observer = new MutationObserver(() => { if (ready()) observer.disconnect(); });
    observer.observe(document.querySelector('#app') || document.body, {childList:true, subtree:true});
    setTimeout(() => observer.disconnect(), 90000);
  }
  window.print = () => send({action:'print'});
  const click = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download && this.href.startsWith('blob:')) {
      const name = this.download;
      fetch(this.href).then(r => r.text()).then(text => send({action:'share', filename:name, text})).catch(() => {
        const toast = document.querySelector('#toast');
        if (toast) { toast.textContent = 'The file could not be prepared. Please try again.'; toast.classList.add('show'); }
      });
      return;
    }
    return click.call(this);
  };
})();
