# cpp-skeleton
## Features

#### Automatic implementations at _.cpp_ files creation giving the matching _.hpp files_.
**The file has to start with an upper-case letter, making it a class .cpp file.**

![oops something went wrong, try to check on https://raw.githubusercontent.com/ldedier/cpp-skeleton/master/medias/cppGif.gif](https://raw.githubusercontent.com/ldedier/cpp-skeleton/master/medias/cppGif.gif)

## Extension Settings

#### Specify these configurations in *User Settings* :

```ts
{
  "cpp-skeleton.headerCommandId": string, //a vscode command ID to execute before the skeleton creation
  "cpp-skeleton.generateSettersAndGetters": boolean, // automatic implementations of getters and setters
}
```

### Commands

You can execute these commands by acceding to the execute console (cmd + shift + P)

#### Add missing methods

![oops something went wrong, try to check on https://raw.githubusercontent.com/ldedier/cpp-skeleton/master/medias/cppGif2.gif](https://raw.githubusercontent.com/ldedier/cpp-skeleton/master/medias/cppGif2.gif)

Checks for methods present in the .hpp file that are not implemented and add them to the current .cpp file

 #### Clear as new skeleton

Clear your .cpp file and rebuild the skeleton from the matching .hpp file

License
----
MIT
