# ED Graham Framework #

ED Graham components

### Run ###

#### Install ####
```
npm install  
```

#### Build ####
```
npm run build
```

#### Usage ####
```
edMessageBus.emit(
  edAlertMessageConstants.MESSAGE_EVT, {
      message: "Welcome",
      errorLevel: 2,
      context: edCoreConstants.errorMessageContexts.USER
  }
);
```
