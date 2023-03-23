# Chive+
## Overview
Chive+ is a *modern programming language* that is designed to make programming more *enjoyable* and *simpler*. It has many features that make it easy to read, write and maintain.

The Chive+ language is *transpiled* into *Dart* and *JavaScript*, making it easily accessible to web developers. This transpilation ensures that any Chive+ code can be run on any platform that supports Dart and JavaScript.
You are currently viewing the school branch which holds a copy that should not be altered by anyone besides the creator, me (CodeBoy124)

## Getting Started
To get started with Chive+ language, you need to have an editor installed on your computer, such as Visual Studio Code Studio or Neovim. Once you have the editor installed, you can create a new file with the .chv extension.
Before you can use the cli tool you do need to of course install it.
This can be done by running the following. You do need to have npm installed
```console
npm install -g chv
```

To initialize a project run the following
```console
chv init
```

When you have written your code you can compile your code to the desired output using this command:
```console
chv compile
```

By default chive searches all files and folders in the current working directory for files ending in .chv, however you can change the file extension using the --ext flag.
You can also compile a single file using the -f flag, but keep in mind you still have to use the --ext flag is you want to change the file extension.

## Features
Chive+ has many features that make it a powerful programming language. Some of the prominent features of Chive+ are:

### Static and Strongly Typed
Chive+ is a *statically* and *strongly typed* language. This means that every variable must be defined with a data type, and the variable cannot be reassigned to a different data type.

```dart
int age = 25;
String name = "John";
```

### Functions
Chive+ supports functions, which are blocks of reusable code that perform a specific task. Functions can take parameters and return values.
It is important to keep in mind that Chive+ does not add any default library for handling inputs and outputs. The print function in the examples is therefor hypothetical/dart specific.

```dart
int addNumbers(int a, int b) {
  return a + b;
}
```

### Conditional Statements
Chive+ supports conditional statements, which allow you to make decisions in your code based on specific conditions.

```dart
int age = 18;

if (age >= 18) {
  print("You are an adult");
} else {
  print("You are not an adult");
}
```

### Loops
Chive+ supports loops, allowing you to repeat a block of code multiple times.

```dart
for (int i = 0; i < 10; i++) {
  print(i);
}
```

### Imports
Chive+ has support to reference other files. This allows you to seperate your code to make it more readable.
The import statement is a 'build comment', some code that can be imagened to run before the code is transpiled

```dart
#import myFunction from otherFile.chv
```

### Constant definitions
Chive+ allows you to write constant. This is also a build comment. it replaces all matches of the name inside the actual code with the defined value

```
#define MSG Hello, World!
print("MSG")
```

therefor gets transpiled to:

```javascript
print("Hello, World!");
```

### Comments
Chive+ supports comments, allowing you to add notes within your code.
Since comments are kept in the output code you can also easily explain things to your collegues

```dart
// This is a single-line comment

/*
This is a multi-line comment
that spans multiple lines
*/
```

### Chive+ missing features
Chive+ does (at least currently) not support arrays/lists.
It also doesn't have classes or any builtin utility functions, although that can be solved easily and therefor might be fixed soon.

## Conclusion
Chive+ is a small, but usefull programming language that is transpiled into both Dart and JavaScript. It was designed to be used in combination with other programming languages making it easy to slowly addopt into your project and still keep the code readable

## Contributing
So you wish to contribute to this rather small project.
Feel free to do so, but since I started this project for school you should not alter the school branch.
Other than that you can open any pull request and I'll (if I have time) take a look at what to merge.
