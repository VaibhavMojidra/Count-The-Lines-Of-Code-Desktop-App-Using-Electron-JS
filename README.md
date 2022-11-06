# Count The Lines Of Code Desktop App (Cross-Platform Windows, Mac, Linux)

![1](https://github.com/VaibhavMojidra/Count-The-Lines-Of-Code-Desktop-App-Using-Electron-JS/blob/master/screenshots/count_the_lines_of_code.gif)

## Download App

[Download for Windows](https://drive.google.com/file/d/11LMwwgBxxzQlyZnmtDrI_k0XJTMoV5PJ/view?usp=sharing)

[Download for Mac](https://drive.google.com/file/d/1XUz7xfNNP2ri1HsFQCv5kxvcJwk8k-Ud/view?usp=sharing)

[Download for Linux](https://drive.google.com/file/d/1XDJk_nrkg2NX92SX4XmS1bIxzAqN3MxS/view?usp=sharing)

## Description

This software allows you to count the lines of code in your project/app. Even while it can be done in one click, eliminating the tedious task of manually counting the lines of each file by opening one by one, we nevertheless recommend that users verify the following before selecting the project folder for scan:

To begin with, while there is no harm in using the original project folder, we strongly advise you to create a local copy of the original project folder.

When calculating the lines of code, we use the following criteria:
1. The following file extensions will be excluded from the scanning process: .pdf, .png, .jpg, .jpeg, .gif, .mp4, .mov, and .svg.
2. It will also exclude hidden files and folders, for example, *.git* folder.
3. It will exclude the .DS_Store file, which is found in the majority of Mac OS directories.
4. Finally, count code excluding the empty-lines for example in code if there are 15 lines but there are 4 empty lines (line 2, 4, 6 & 11) in those 15 lines that means the lines of code is 11 lines so scan will count 11 lines for this code.

Assuming you created a copy of the original folder, we recommend that you make certain changes to the copied folder before scanning it.
This is completely optional, but many projects have a large library/dependency folder that we shouldn't count lines of code in, for example, the *node_modules* folder. It's a good idea to delete such folders/files from the copy folder (copy of the original project folder) before scanning (if not it will be also included in scan).


## Screenshots


![S1](https://github.com/VaibhavMojidra/Count-The-Lines-Of-Code-Desktop-App-Using-Electron-JS/blob/master/screenshots/1.jpeg)
![S2](https://github.com/VaibhavMojidra/Count-The-Lines-Of-Code-Desktop-App-Using-Electron-JS/blob/master/screenshots/2.jpeg)
![S3](https://github.com/VaibhavMojidra/Count-The-Lines-Of-Code-Desktop-App-Using-Electron-JS/blob/master/screenshots/3.jpeg)
![S4](https://github.com/VaibhavMojidra/Count-The-Lines-Of-Code-Desktop-App-Using-Electron-JS/blob/master/screenshots/4.jpeg)
![S5](https://github.com/VaibhavMojidra/Count-The-Lines-Of-Code-Desktop-App-Using-Electron-JS/blob/master/screenshots/5.jpeg)
![S6](https://github.com/VaibhavMojidra/Count-The-Lines-Of-Code-Desktop-App-Using-Electron-JS/blob/master/screenshots/6.jpeg)


