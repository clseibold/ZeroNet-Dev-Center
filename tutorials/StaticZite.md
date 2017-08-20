## Introduction
In this tutorial, we are going to be making a very simple static zite, go through the different options in the `content.json` file, and talk about the ZeroFrame class that is auto-generated when you create an empty zite, what it is used for, and why it is important.

Note that it is recommended to read [The Basics](./?/tutorials/the_basics) tutorial first. It provides usefull information on how zites are kept secure, updated, how to keep your zite online, and a other important information.

## Creating An Empty Zite
In order to create a zite, first we need to create an empty zite that will generate an address for us. You can very easily do this in the ZeroHello page by going to the menu (denoted by the 3 dots beside the ZeroHello Logo) and clicking `Create new, empty site`. It will create an address for you, along with a directory where you zite's files will be stored and a default `index.html` page. Do not delete this page, because we will just be adding to it instead of creating one from scratch. You will be redirected to your new zite by ZeroHello.

## Where Are The Zite's Files Located?
When ZeroHello created your empty zite, it created a new directory for it. This directory is located in the `zeronetroot/data` directory under a folder named by your zite's address. You can find where the ZeroNet root directory is by pressing `show data directory` in ZeroHello's menu.

## The content.json File
The first file we are going to open is the zite's `content.json` file. This file is used to keep your zite secure, and provide options for your zite. [The Basics](./?/tutorials/the_basics) tutorial covers how this file is used to keep your zite secure and from being tampered with. However, this tutorial will cover the options that you can set in this file for your zite. If you are unfamiliar with JSON, you should learn it before going forward with zite development. Trust me, JSON is pretty easy.

### Description and Title
The first thing we are going to do is change the zite's description and title. Look for the description and title fields and change them to what you want. The Title field is what is shown in the title/tab bar and in ZeroHello. The description is used for Search Engines among other things.

### Ignore Field and Regexes
Next, we are going to modify the `ignore` field. The ignore field is used to tell ZeroNet which files you do not want seeded and sent to peers. Any files/folders that match this ignore field will stay on your computer only, and will not be sent to other peers. This is useful for the git directory, an admin directory, and database files.

Database files (ending in `.db`) are ignored because the database is generated from the json files per client. Clients do not share database files.

The `ignore` field uses a regular expression to match any folders and files against it. Because of this, it is recommended to learn a little bit about regular expressions. However, here is a simple list of things most used in regular expressions and what they mean:
* `.` - any character
* `*` - zero or more of the character or group that comes before it
* `+` - *one* or more of the character or group that comes before it.
* Putting a letter that doesn't have a special meaning means it is a required character.
* `(` and `)` - Creates a group, usefull for saying you want zero or more of a word (for example: `(and)*` means zero or more `and` words)
* `|` used in a group to mean *or*. For eample: `(and|or)` means it will match anything that is the word `and` *or* the word `or`.
* `\.` - the dot character. You are escaping the dot. This also works for `\*`, `\|`, `\\` and any other special symbols.

*NOTE:* It should be noted that a recent update to ZeroNet requires that you must place `.` before `*`, `+`, and `{`. You also cannot have more than 9 of these repetition characters. To fix this, if you are using `.*` for each *or branch* in a group, you can easily put it outside of the group (for example: change `(.*.epub|.*.jpg|.*.jpeg|.*.png)` to `.*(epub|jpg|jpeg|png)`). This is for security and performance reasons.

Here are some useful patterns used in a regular expression. We will be using some of these in our `ignore` regex.
* To ignore a folder, put `foldername`.
* To ignore a file with a certain extension, put `.*db`
* To ignore files of many extensions, you can use a group like this: `.*(ext1|ext2|ext3)`
* To ignore files, directories, and sub-directories in a folder, use this: `folder/.*/.*`

For our ignore regex, we are going to use this: `(data/.*db|data/users/.*/.*|.git|admin)`. This will ignore the `.git` folder, the `admin` folder, the database, and the `data/users` folder and its subdirectories. The reason for the last one will be covered in the Database Basics tutorial.

### Viewport
The final thing twe are going to do is add a `viewport` field. This is equivalent to adding the viewport meta tag.

* For mobile-supported zites, set the viewport to `width=device-width, initial-scale=1.0, shrink-to-fit=no`
* For non-mobile-supported zites, you can leave it off.

## The Index File
We are now done with the `content.json` file. Next, open up the `index.html` file. This is what the index file should look like:

```html
<!DOCTYPE html>

<html>
<head>
 <title>New ZeroNet site!</title>
 <meta charset="utf-8">
 <meta http-equiv="content-type" content="text/html; charset=utf-8" />
 <base href="" target="_top" id="base">
 <script>base.href = document.location.href.replace("/media", "").replace("index.html", "").replace(/[&?]wrapper=False/, "").replace(/[&?]wrapper_nonce=[A-Za-z0-9]+/, "")</script>
</head>
<body>

<div id="out"></div>

<script type="text/javascript" src="js/ZeroFrame.js"></script>
<script>

class Page extends ZeroFrame {
	setSiteInfo(site_info) {
		var out = document.getElementById("out")
		out.innerHTML =
			"Page address: " + site_info.address +
			"<br>- Peers: " + site_info.peers +
			"<br>- Size: " + site_info.settings.size +
			"<br>- Modified: " + (new Date(site_info.content.modified*1000))
	}

	onOpenWebsocket() {
		this.cmd("siteInfo", [], function(site_info) {
			page.setSiteInfo(site_info)
		})
	}

	onRequest(cmd, message) {
		if (cmd == "setSiteInfo")
			this.setSiteInfo(message.params)
		else
			this.log("Unknown incoming message:", cmd)
	}
}
page = new Page()
</script>

</body>
</html>
```

You can see that most of it is just simple html. However, there is the javascript that has the `ZeroFrame` class. This is what we are going to be talking about next.

### The ZeroFrame Class

