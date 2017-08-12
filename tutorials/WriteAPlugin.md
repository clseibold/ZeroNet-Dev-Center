## Introduction

In ZeroNet, it is possible to add plugins. Some of the features that we already use are actually plugins which is available at download like `MergerSite` or `ǸewsFeed`. For now, there is no plugin store available in which you can select which one you want to install but it is still quite simple to add, disable or create a plugin. In this tutorial, we will see how to write one really simple plugin and how to interact with it from a zite.

> Note: I advice to read [The Basics](http://127.0.0.1:43110/14pM9huTYzJdyQyHRj6v2kfhMe8DrxwpGt/?/tutorials/the_basics) tutorial first. We will need to create one in order to test our plugin.


## ZeroNet Plugins

In your ZeroNet folder will find a `plugin` folder. If you have installed ZeroNet throught ZeroBundle, you might find it under the `core` folder.

You should see a bunch of folders like the following :

```
.
├── AnnounceZero
├── Cors
├── CryptMessage
├── disabled-Bootstrapper
├── disabled-Dnschain
├── disabled-DonationMessage
├── disabled-Multiuser
├── disabled-StemPort
├── disabled-UiPassword
├── disabled-Zeroname-local
├── FilePack
├── MergerSite
├── Mute
├── Newsfeed
├── OptionalManager
├── PeerDb
├── Sidebar
├── Stats
├── TranslateSite
├── Trayicon
└── Zeroname

```

We can notice that some folders name have the prefix `disabled-` it means that those plugins are not active. If you want to active them you can rename them and remove this prefix. Once ZeroNet restart those plugin will load.

It means that if you want to add a new plugin you just need to copy it in a new folder inside this `plugin` folder.

Now we can start writting our own plugin.

## Hello World ZeroNet Plugin
