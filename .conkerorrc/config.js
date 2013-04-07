allow_browser_window_close = false;

external_content_handlers.set('application/pdf', 'evince')

cwd=get_home_directory();
cwd.append("downloads");

download_buffer_automatic_open_target=OPEN_NEW_BUFFER_BACKGROUND;
hint_digits="0abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ";
url_remoting_fn = load_url_in_new_buffer;

add_hook("mode_line_hook", mode_line_adder(downloads_status_widget));
add_hook("mode_line_hook", mode_line_adder(buffer_count_widget), true);
remove_hook("mode_line_hook", mode_line_adder(clock_widget));

add_hook("window_before_close_hook",
         function (w) {
             var result = yield w.minibuffer.read_single_character_option(
                 $prompt = "Close window? (y/n)",
                 $options = ["y", "n"]);
             yield co_return(result == "y");

         });

define_key(content_buffer_normal_keymap, "d", "follow-new-buffer-background");
define_key(content_buffer_normal_keymap, "y", "block-images-toggle");
define_key(content_buffer_normal_keymap, "j", "javascript-toggle");
define_key(content_buffer_normal_keymap, "W", "content-policy-whitelist-show");
define_key(content_buffer_normal_keymap, "w", "content-policy-whitelist-toggle-current-origin");

define_webjump("crawl", "http://crawl.chaosforge.org/index.php?title=%s");
define_webjump("github", "http://github.com/search?q=%s&type=Everything");
define_webjump("krautchan", "https://krautchan.net/board/%s");
define_webjump("logs", "http://logs.2pktfkt.de/%s");
define_webjump("reddit","http://www.reddit.com/r/%s");
define_webjump("rfc", "http://tools.ietf.org/html/rfc%s.txt");
define_webjump("wayback", function (url) {
    if (url) {
        return "http://web.archive.org/web/*/" + url;
    } else {
        return "javascript:window.location.href='http://web.archive.org/web/*/'+window.location.href;";
    }
}, $argument = "optional");

require("block-content-focus-change.js");

require("content-policy.js");

var Set = function() {}
Set.prototype.add = function(o) { this[o] = true; }
Set.prototype.remove = function(o) { delete this[o]; }
Set.prototype.toString = function() {
    var l = [];
    for (var e in this) {
        if (this.hasOwnProperty(e)) {
            l.push(e)
        }
    }
    return l;
};

var content_policy_origin_whitelist = new Set();

function uri_origin(uri) {
    return uri.scheme + ' ' + uri.host + ' ' + uri.port;
}

interactive("content-policy-whitelist-toggle-current-origin",
    "Toggle if current origin is whitelisted for content policy.",
    function (I) {
        var origin = uri_origin(I.buffer.current_uri);
        if (origin in content_policy_origin_whitelist) {
            content_policy_origin_whitelist.remove(origin);
            I.minibuffer.message("Origin " + origin + " removed from content policy whitelist.");
        } else {
            content_policy_origin_whitelist.add(origin);
            I.minibuffer.message("Origin " + origin + " whitelisted for content policy.");
        }
    }
);

interactive("content-policy-whitelist-show",
    "Show content policy origin whitelist.",
    function (I) {
        I.minibuffer.message("Allowed origins: " + content_policy_origin_whitelist.toString())
    }
);

function block_content(content_type, content_location, request_origin) {
    if (uri_origin(request_origin) in content_policy_origin_whitelist) {
        return content_policy_accept;
    } else {
        return content_policy_reject;
    };
};

content_policy_bytype_table.font = block_content;
content_policy_bytype_table.image = block_content;
content_policy_bytype_table.media = block_content;
content_policy_bytype_table.object = block_content;
content_policy_bytype_table.script = block_content;
add_hook("content_policy_hook", content_policy_bytype);

interactive("block-images-toggle",
    "Turn the image blocking off if it is on and on if it is off.",
    function (I) {
        if (content_policy_bytype_table.image == block_content) {
            content_policy_bytype_table.image = function () content_policy_accept;
            I.minibuffer.message("Images allowed.");
        } else {
            content_policy_bytype_table.image = block_content;
            I.minibuffer.message("Images blocked.");
        }
    }
);

interactive("javascript-toggle",
    "Turn javascript off if it is on, and on if it is off.",
    function (I) {
        if (get_pref('javascript.enabled')) {
            session_pref('javascript.enabled', false);
            I.minibuffer.message("JavaScript disabled.");
        } else {
            session_pref('javascript.enabled', true);
            I.minibuffer.message("JavaScript enabled.");
        }
    }
);

let (sheet = get_home_directory()) {
    sheet.appendRelativePath('.conkerorrc/userstyle.css');
    register_user_stylesheet(make_uri(sheet));
}

require("adblockplus.js");

require("favicon");
add_hook("mode_line_hook", mode_line_adder(buffer_icon_widget), true);

session_pref("intl.accept_languages", "de-de, de, en-us, en");
session_pref('javascript.enabled', false);

set_protocol_handler("mailto", find_file_in_path("claws-mail"));
