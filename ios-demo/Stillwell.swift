import UIKit
import WebKit

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, configurationForConnecting session: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let config = UISceneConfiguration(name: "Stillwell", sessionRole: session.role)
        config.delegateClass = SceneDelegate.self
        return config
    }
}

final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options: UIScene.ConnectionOptions) {
        guard let scene = scene as? UIWindowScene else { return }
        let window = UIWindow(windowScene: scene)
        window.overrideUserInterfaceStyle = .light
        window.rootViewController = StillwellController()
        window.makeKeyAndVisible()
        self.window = window
    }
}

final class StillwellController: UIViewController, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler, UITabBarDelegate {
    private let host = "stillwell-vip-demo.onrender.com"
    private let plum = UIColor(red: 77/255, green: 41/255, blue: 69/255, alpha: 1)
    private let pink = UIColor(red: 246/255, green: 213/255, blue: 226/255, alpha: 1)
    private var web: WKWebView!
    private let tabs = UITabBar()
    private let loading = UIStackView()
    private let status = UILabel()
    private let retry = UIButton(type: .system)
    private let spinner = UIActivityIndicatorView(style: .medium)
    private let routes = ["overview", "companion", "records", "visits"]

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        let config = WKWebViewConfiguration()
        config.websiteDataStore = .default()
        config.defaultWebpagePreferences.preferredContentMode = .mobile
        config.userContentController.add(self, name: "stillwell")
        let css = try! String(contentsOf: Bundle.main.url(forResource: "mobile", withExtension: "css")!, encoding: .utf8)
        let cssJSON = String(data: try! JSONSerialization.data(withJSONObject: [css]), encoding: .utf8)!
        let bridge = try! String(contentsOf: Bundle.main.url(forResource: "bridge", withExtension: "js")!, encoding: .utf8)
        config.userContentController.addUserScript(WKUserScript(source: "window.stillwellMobileCSS = \(cssJSON)[0];\n" + bridge, injectionTime: .atDocumentEnd, forMainFrameOnly: true))
        web = WKWebView(frame: .zero, configuration: config)
        web.navigationDelegate = self
        web.uiDelegate = self
        web.isOpaque = false
        web.backgroundColor = .white
        web.scrollView.backgroundColor = .white
        web.scrollView.contentInsetAdjustmentBehavior = .never
        web.scrollView.keyboardDismissMode = .interactive
        web.allowsBackForwardNavigationGestures = false
        web.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(web)

        tabs.translatesAutoresizingMaskIntoConstraints = false
        tabs.delegate = self
        tabs.tintColor = plum
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = .white
        appearance.shadowColor = pink
        for item in [appearance.stackedLayoutAppearance, appearance.inlineLayoutAppearance, appearance.compactInlineLayoutAppearance] {
            item.normal.iconColor = UIColor(red: 117/255, green: 88/255, blue: 109/255, alpha: 1)
            item.normal.titleTextAttributes = [.foregroundColor: item.normal.iconColor!]
            item.selected.iconColor = plum
            item.selected.titleTextAttributes = [.foregroundColor: plum, .font: UIFont.systemFont(ofSize: 10, weight: .semibold)]
        }
        tabs.standardAppearance = appearance
        tabs.scrollEdgeAppearance = appearance
        let titles = ["Today", "Companion", "My health", "My visit"]
        let symbols = ["leaf", "bubble.left.and.bubble.right", "folder", "calendar"]
        tabs.items = titles.enumerated().map { index, title in
            UITabBarItem(title: title, image: UIImage(systemName: symbols[index]), tag: index)
        }
        tabs.selectedItem = tabs.items?.first
        view.addSubview(tabs)
        let restingBottom = web.bottomAnchor.constraint(equalTo: tabs.topAnchor)
        restingBottom.priority = .defaultHigh
        NSLayoutConstraint.activate([
            tabs.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tabs.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tabs.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            tabs.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -53),
            web.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            web.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            web.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            restingBottom,
            web.bottomAnchor.constraint(lessThanOrEqualTo: view.keyboardLayoutGuide.topAnchor)
        ])

        loading.axis = .vertical
        loading.alignment = .center
        loading.spacing = 18
        loading.translatesAutoresizingMaskIntoConstraints = false
        let leaf = UIImageView(image: UIImage(systemName: "leaf.fill"))
        leaf.tintColor = plum
        leaf.contentMode = .scaleAspectFit
        leaf.heightAnchor.constraint(equalToConstant: 48).isActive = true
        let wordmark = UILabel()
        wordmark.text = "stillwell"
        wordmark.font = .systemFont(ofSize: 36, weight: .bold)
        wordmark.textColor = plum
        status.text = "Opening your health space…"
        status.font = .systemFont(ofSize: 15)
        status.textColor = plum
        status.textAlignment = .center
        status.numberOfLines = 0
        spinner.color = plum
        retry.setTitle("Try again", for: .normal)
        retry.tintColor = plum
        retry.addTarget(self, action: #selector(loadProduct), for: .touchUpInside)
        [leaf, wordmark, status, spinner, retry].forEach { loading.addArrangedSubview($0) }
        view.addSubview(loading)
        NSLayoutConstraint.activate([
            loading.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            loading.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -40),
            loading.widthAnchor.constraint(lessThanOrEqualTo: view.widthAnchor, constant: -64)
        ])
        loadProduct()
    }

    @objc private func loadProduct() {
        loading.isHidden = false
        web.alpha = 0
        retry.isHidden = true
        status.text = "Opening your health space…"
        spinner.startAnimating()
        var request = URLRequest(url: URL(string: "https://\(host)/?ios-demo=1#overview")!)
        request.timeoutInterval = 90
        web.load(request)
    }

    func tabBar(_ tabBar: UITabBar, didSelect item: UITabBarItem) {
        web.endEditing(true)
        web.evaluateJavaScript("document.querySelector('dialog[open]')?.close(); location.hash='\(routes[item.tag])'; window.scrollTo(0,0);")
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        webView.evaluateJavaScript("Boolean(document.querySelector('#app .page'))") { [weak self] value, _ in
            guard let self else { return }
            if value as? Bool == true { self.showProduct() }
            else {
                self.status.text = "Stillwell is getting ready…"
                self.retry.isHidden = false
            }
        }
    }
    private func showProduct() {
        spinner.stopAnimating()
        loading.isHidden = true
        web.alpha = 1
    }
    private func fail(_ message: String) {
        status.text = message
        spinner.stopAnimating()
        retry.isHidden = false
        loading.isHidden = false
    }
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) { fail("Couldn’t connect to Stillwell. Check the internet connection and try again.") }
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) { fail("This screen couldn’t load. Please try again.") }
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) { loadProduct() }
    func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = action.request.url else { decisionHandler(.cancel); return }
        // Only the hosted prototype receives the native bridge. External pages never replace it.
        let allowed = (url.scheme == "https" && url.host == host) || url.scheme == "blob" || url.absoluteString == "about:blank"
        decisionHandler(allowed ? .allow : .cancel)
    }

    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.frameInfo.isMainFrame, message.frameInfo.securityOrigin.host == host,
              let body = message.body as? [String: Any], let action = body["action"] as? String else { return }
        if action == "ready" { showProduct() }
        if action == "route", let route = body["route"] as? String {
            let index = routes.firstIndex(of: route) ?? (["tracking", "insights"].contains(route) ? 2 : 0)
            tabs.selectedItem = tabs.items?[index]
        }
        if action == "share", let text = body["text"] as? String, text.utf8.count <= 5_000_000 {
            let filename = (body["filename"] as? String ?? "stillwell-brief.txt") as NSString
            let file = FileManager.default.temporaryDirectory.appendingPathComponent(filename.lastPathComponent)
            do {
                try text.write(to: file, atomically: true, encoding: .utf8)
                let sheet = UIActivityViewController(activityItems: [file], applicationActivities: nil)
                sheet.popoverPresentationController?.sourceView = view
                present(sheet, animated: true)
            } catch { fail("The file couldn’t be prepared. Please try again.") }
        }
        if action == "print" {
            let printController = UIPrintInteractionController.shared
            printController.printFormatter = web.viewPrintFormatter()
            printController.present(animated: true)
        }
    }

    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let alert = UIAlertController(title: "Stillwell", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completionHandler(false) })
        alert.addAction(UIAlertAction(title: "Continue", style: .default) { _ in completionHandler(true) })
        present(alert, animated: true)
    }
}
