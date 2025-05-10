# Steps to Push Changes to the Remote Repository:
## 1.Check the Current Status:
First, make sure you know which files you've modified. Run the following command to check the status:
```bash
git status
```

This will show you any modified, added, or deleted files that have not been staged for commit.

## 2.Stage the Changes:
To stage the files that you want to commit, use:
```bash
git add . < file >
```

## 3.Commit the Changes:
After staging, you need to commit your changes. You can include a message to describe what you’ve changed:
```bash git commit -m "Your commit message describing the changes"
```

## 4.Push the Changes:
Now, push your changes to the remote repository. If you are working on the main branch, you can use:
```bash
git push origin main
```
This will push your local commits to the main branch on the remote repository (origin).


# (Optional) Tag a New Version:
If you want to create a new version tag to mark this update (e.g., version_02), you can do so after committing. Here’s how to create and push a new tag:

Create a new tag:
```bash
git tag version_02
```


Push the tag to the remote:
```bash
git push origin version_02
```