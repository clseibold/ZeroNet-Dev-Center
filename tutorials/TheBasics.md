## Introduction

Before we start creating zites, it is useful to know how zites work on ZeroNet. This tutorial will take you through how to create an empty zite, where to put your code, what you need before you can publish your zite, and how they are updated, transfered, and kept secure.

Zites are made up of basic web code, including html, css, and js. However, json files are used for storing data and for telling ZeroNet what databases you have and how they are structured.

Since ZeroNet makes no use of a server - everything is downloaded to your computer and ran locally - there is no way to do server side scripting. However, this is remedied by using the ZeroNet API called ZeroFrame. This API lets you ...[^1]

## Creating A Zite

There are currently two ways of creating a zite. You can clone an existing zite, or you can create your own zite from scratch. If you decide to clone a zite, there are many of them you can choose from, including ... However, if you wan't to create your own zite from scratch, that is what the next few tutorials are going to cover.

In order to clone a zite, find a zite you want to clone, visit the zite so that it is downloaded to your computer. Next, go back to ZeroHello and find the zite in the sidebar. Click the menu icon, and press 'Clone'.

## The Sidebar



## Content.json File, What is It?
When a visitor visit's your zite, the first thing they download is the zite's `content.json` file. This `content.json` file holds all of the other file names which must be downloaded in order to use the zite, along with their hashes so it can be verified that they are downloading the correct files. It basically gives information on the *content* of the zite. This file also holds a cryptographic digital signature that was created by the owner to verify that the content.json file has not been tampered with by anyone other than the zite owner. 

The file does contain other information like what ZeroNet version the zite was created for, the modified number to tell what version of the zite you are downloading, the zite's title and description, the address from which you cloned the zite, and any other important information.

## Signing the Content.json File
Whenever you make any changes to your zite, including to the content.json file, you must *sign* the file. This ensures that whenever a person downloads your zite, they know these changes were made by the zite owner. Signing your content.json file will also update the hashes to all of the files stored and used on your zite.

**NOTE:** If you do not sign the `content.json` file, visitors will not be able to download this updated version of your zite for security reasons. If you have no peers, they will not be able to visit your zite at all since they can't download a *signed* `content.json` file elsewhere. So **make sure you sign this file before you publish it.**

To sign this file, you go to the sidebar and, in the `This is my site` section, click `Sign`.

## How Zites Are Kept Secure


## Publishing Your Zite
In order to publish your zite, you simply sign your `content.json` file and publish it. These buttons are located in the sidebar under the `This is my site` section. If you do not have any peers, you do not need to click publish. Publish only sends the content.json file to other peers. Without peers, there is no need because these peers will download your zite from your computer.

## Keeping Your Zite Online
In order to keep your zite online, you need peers that are reliable and always on. If your computer will not be connected to ZeroNet all the time, you will have to either have enough people to ensure your peer count won't go down to zero when you are offline, or you will have to find *at least* one peer that will always be online.

[TODO]

## Updating Your Zite
[TODO]

[^1]: There is a page on the ZeroNet Read The Docs that gives a reference to the ZeroFrame API [here](/17Kom2G5qNDc6NaQwv445h1gFzxkY3ZtZe/site_development/zeroframe_api_reference/).