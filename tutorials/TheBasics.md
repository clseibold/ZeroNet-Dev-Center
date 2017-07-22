## Introduction

Before we start creating zites, it is useful to know how zites work on ZeroNet. This tutorial will take you through how to create an empty zite, where to put your code, what you need before you can publish your zite, and how they are updated, transfered, and kept secure.

Zites are made up of basic web code, including html, css, and js. However, json files are used for storing data and for telling ZeroNet what databases you have and how they are structured.

Since ZeroNet makes no use of a server - everything is downloaded to you computer and ran locally - there is no way to do server side scripting. However, this is remedied by using the ZeroNet API called ZeroFrame. This API lets you ...

## Creating A Zite

There are currently two ways of creating a zite. You can clone an existing zite, or you can create your own zite from scratch. If you decide to clone a zite, there are many, you can choose from, including ... However, if you wan't to create your own zite from scratch, that is what the next few tutorials are going to cover.

In order to clone a zite, find a zite you want to clone, visit the zite so that it is downloaded to your computer. Next, go back to [ZeroHello](zero://1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D/) and find the zite in the sidebar. Click the menu icon, and press 'Clone'.

## The Sidebar

The Sidebar is _the_ place, where you can view information about any zite. It can be accessed by visiting a zite, and pulling the transluscent circle with the `0` in the middle, to the left. Here you can see an interactive globe that you can rotate, which displays all the peers over the globe.
There is a list of different items under it:
1. **Peers**:
Shows to how many peers you are connected, how many there are to which you can connect, how many use Onion, and the total amount of peers
2. **Data Transfer**: Shows how much data you have sent and received on the zite opened
3. **Files**: Shows what the summed size of the different file-formats are
4. **Size Limit**: Shows, how much of the filesize-limit you are using (in %), what the available free space is, on your harddrive, and an input to set the zites filesize-limit
5. **Optional Files**: Shows how much data you have downloaded, of all the optional files on the zite
6. **Download and help distribute all files**: Switch, to toggle if you want to download and seed _all_ the optional files
7. **Database**: Shows how big the database is, the path to it (relative to the zites path), a button to reload the Database-Scheme, and a button to rebuild the database
8. **Identity Address**: Shows how much storage you filled on the zite, of which the total is set by the Owner, and your Authentication-Address, with a button to select another account
9. **Site Control**: The first button tries to fetch the newest version available to any connected peer, the second pauses the download of any new data, and the third deletes the complete zite from the harddrive
10. **Site Address**: Displays the zites address (this might be helpful for finding the zite in your data-dir, if you are accessing it via a `.bit`-address)
11. **Missing Files**: Shows a list of all files, that are missing, according to the ZeroNet-Client
12. **This is my site**: Switch, to toggle, if you own this zite. If this is active, a few other items will appear underneath

The List-part **This is my site**:
1. **Site Title**: Input to change the title of the zite
2. **Site Description**: Input to change the description of the zite
3. **Save site settings**: A button, to save the last two inputs to the zites `content.json`-File
4. **Content Publishing**: A list of files you can sign (click them to insert them into the input below), an input to input the file you want to sign/publish, a button to sign the selected file, and another one, to publish it to connected peers