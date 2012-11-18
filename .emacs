(custom-set-variables
  ;; custom-set-variables was added by Custom.
  ;; If you edit it by hand, you could mess it up, so be careful.
  ;; Your init file should contain only one such instance.
  ;; If there is more than one, they won't work right.
 '(current-language-environment "German")
 '(font-use-system-font t)
 '(inhibit-startup-screen t))
(custom-set-faces
  ;; custom-set-faces was added by Custom.
  ;; If you edit it by hand, you could mess it up, so be careful.
  ;; Your init file should contain only one such instance.
  ;; If there is more than one, they won't work right.
 )
(desktop-save-mode 1)

(global-linum-mode t)

(prefer-coding-system       'utf-8)

(require 'show-wspace)
(add-hook 'font-lock-mode-hook 'show-ws-highlight-tabs)
(add-hook 'font-lock-mode-hook 'show-ws-highlight-trailing-whitespace)

(setq default-buffer-file-coding-system 'utf-8)
(setq-default indent-tabs-mode nil)
(setq-default tab-width 4)

(add-to-list 'load-path "~/.emacs.d/")
(autoload 'n3-mode "n3-mode" "Major mode for OWL or N3 files" t)
(add-hook 'n3-mode-hook 'turn-on-font-lock)

(setq auto-mode-alist
    (append
        (list
            '("\\.n3" . n3-mode)
            '("\\.owl" . n3-mode))
    auto-mode-alist))

(setq browse-url-browser-function 'browse-url-generic
    browse-url-generic-program "/usr/bin/conkeror")

(server-start)
