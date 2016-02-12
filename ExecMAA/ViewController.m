//
//  ViewController.m
//  ExecMAA
//
//  Created by CA Technologies Inc. on 28/12/15.
//  Copyright © 2016 CA Technologies Inc. All rights reserved.
//

#import "ViewController.h"
#import "KeychainItemWrapper.h"
@interface ViewController ()
    @property(strong, nonatomic) WKWebView *theWebView;
    @property(strong, nonatomic) KeychainItemWrapper *keychain;
    @property(strong, nonatomic) WKNavigation *indexNavigation;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    NSString *path = [[NSBundle mainBundle] pathForResource:@"index" ofType:@"html"];
    NSURL *url = [NSURL fileURLWithPath:path];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
//    
//    NSString* content = [NSString stringWithContentsOfFile:path
//                                                  encoding:NSUTF8StringEncoding
//                                                     error:NULL];
    
    WKWebViewConfiguration *theConfiguration =
    [[WKWebViewConfiguration alloc] init];
    WKUserContentController *controller = [[WKUserContentController alloc]
                                           init];
    
    [controller addScriptMessageHandler:self name:@"camaa"];

    theConfiguration.userContentController = controller;
    
    _theWebView = [[WKWebView alloc] initWithFrame:self.view.frame
                                     configuration:theConfiguration];
    [_theWebView setUIDelegate:self];

    _theWebView.navigationDelegate = self;
    
    [self.view addSubview:_theWebView];
    [_theWebView setTranslatesAutoresizingMaskIntoConstraints:false];
//    let height = NSLayoutConstraint(item: webView, attribute: .Height, relatedBy: .Equal, toItem: view, attribute: .Height, multiplier: 1, constant: 0)
//    let width = NSLayoutConstraint(item: webView, attribute: .Width, relatedBy: .Equal, toItem: view, attribute: .Width, multiplier: 1, constant: 0)
    NSLayoutConstraint* height = [NSLayoutConstraint constraintWithItem:_theWebView
                                                              attribute:NSLayoutAttributeHeight
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:self.view
                                                              attribute:NSLayoutAttributeHeight
                                                             multiplier:1.0 
                                                               constant:0];
    NSLayoutConstraint* width = [NSLayoutConstraint constraintWithItem:_theWebView
                                                              attribute:NSLayoutAttributeWidth
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:self.view
                                                              attribute:NSLayoutAttributeWidth
                                                             multiplier:1.0
                                                               constant:0];

    [self.view addConstraint:height];
    [self.view addConstraint:width];
    
    UIRefreshControl *refreshControl = [[UIRefreshControl alloc] init];
    refreshControl.tintColor = [UIColor lightGrayColor];
//    refreshControl.attributedTitle = [[NSAttributedString alloc] initWithString:@"pull to refresh" attributes: @{NSForegroundColorAttributeName:[UIColor lightGrayColor]}];
    [refreshControl addTarget:self action:@selector(handleRefresh:) forControlEvents:UIControlEventValueChanged];
    [_theWebView.scrollView addSubview:refreshControl];
    
    _indexNavigation = [_theWebView loadRequest:request];
    //    [_theWebView loadHTMLString:content baseURL:nil];
}

- (void)handleRefresh:(UIRefreshControl *)refresh {
    [refresh endRefreshing];
    [_theWebView reload];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)userContentController:(WKUserContentController *)userContentController
      didReceiveScriptMessage:(WKScriptMessage *)message {
    NSDictionary *args = message.body;
    _keychain = [[KeychainItemWrapper alloc] initWithIdentifier:@"MAA" accessGroup:nil];
    
    if ([message.name isEqualToString:@"camaa"]) {
        [_keychain setObject:[args objectForKey:@"username"] forKey:(__bridge id)kSecAttrAccount];
        [_keychain setObject:[args objectForKey:@"password"] forKey:(__bridge id)kSecValueData];
        [_keychain setObject:[args objectForKey:@"tenant"] forKey:(__bridge id)kSecAttrService];

        NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
        [prefs setObject:[args objectForKey:@"tenant"] forKey:message.name];
    }
}

- (void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(void))completionHandler {
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:message message:nil preferredStyle:UIAlertControllerStyleAlert];
    
    [alertController addAction:[UIAlertAction
                                actionWithTitle:@"OK"
                                style:UIAlertActionStyleCancel
                                handler:^(UIAlertAction *action) {
                                    completionHandler();
                                }]];
    [self presentViewController:alertController animated:YES completion:^{}];
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
    if (!navigationAction.targetFrame) {
        NSURL *url = navigationAction.request.URL;
        UIApplication *app = [UIApplication sharedApplication];
        if ([app canOpenURL:url]) {
            [app openURL:url];
        }
    }
    decisionHandler(WKNavigationActionPolicyAllow);
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(null_unspecified WKNavigation *)navigation {
    NSString *url = _theWebView.URL.lastPathComponent;
    if ([url caseInsensitiveCompare:@"index.html"] == NSOrderedSame) {
        _keychain = [[KeychainItemWrapper alloc] initWithIdentifier:@"MAA" accessGroup:nil];
        NSString* username = [_keychain objectForKey:(__bridge id)kSecAttrAccount];
        NSString* password = [_keychain objectForKey:(__bridge id)kSecValueData];
        NSString* tenant   = [_keychain objectForKey:(__bridge id)kSecAttrService];
        NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
        NSString *maaurl = [prefs stringForKey:@"maaurl"];
        
        NSMutableString *jsCommand = [NSMutableString string];
        if(username != nil){
            [jsCommand appendString:[NSString stringWithFormat:@"$('#username').val(\"%@\");", username]];
        }
        
        if(password != nil){
            [jsCommand appendString:[NSString stringWithFormat:@"$('#password').val(\"%@\");", password]];
        }
        
        if(tenant != nil){
            [jsCommand appendString:[NSString stringWithFormat:@"$('#tenant').val(\"%@\");", tenant]];
        }
        
        if(maaurl != nil){
            [jsCommand appendString:[NSString stringWithFormat:@"$('#url').val(\"%@\");", maaurl]];
        }
        
        NSString *jsCommandStr = [NSString stringWithString:jsCommand];
        [_theWebView evaluateJavaScript:jsCommandStr completionHandler:nil];
    }
}

@end
