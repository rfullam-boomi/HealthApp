# General health app components.

The latest version can be included in your player from this location: -

```
https://files-manywho-com.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/health.js
https://files-manywho-com.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/health.css
```


# FaceBar

![alt text](https://github.com/MarkWattsBoomi/HealthApp/blob/main/FaceBar.png)


## Functionality

Shows an array of faces, happy to sad to let you choose one.

## Component Settings

width and height if specified control the component's dimensions - in pixels.


## Component Attributes

### classes

Like all components, adding a "classes" attribute will cause that string to be added to the base container's class value

### State

A string to accept the selected value of "1" to "5" 

## Outcomes

1 outcome will be used if defined: -

### OnSelect
This will trigger when a face is selected.
Optional


# MovingDotClicker, CountClicker & DurationClicker

These 3 tests are variations on a single core module

All of them display a dot and allow the user to click on it.

The mode of actual operation is described in the sub sections below.

The common functionality is as follows: -

## Common Component Attributes

### classes

Like all components, adding a "classes" attribute will cause that string to be added to the base container's class value.


### countdownSeconds

Number.

The number of lead in seconds to count down at the start of the test.

Displayed as a countdown timer

Default = 5.

### intervalSeconds

Number.

The number of lead in seconds to count down between rounds.

Default = the value of countdownSeconds.

### startLabel

String.

The label to show on the start button before a test begins.

Ignored and not shown if autoStart is set.

Default = "Begin".

### autoStart

Boolean. Value of "true" or "false".

If true then the "Begin" button is not shown and the test begins immediatly with the countdown

Default = "false".

### inactivitySeconds

Number.

The number of seconds of inactivity before a warning is displayed.

Default = -1.  No inactivity check done.

### timeoutTitle

String.

The dialog title message.

Default = "Inactivity".

### timeoutMessage

String.

The dialog body message.

Default = "No activity detected".


### timeoutContinueLabel

String.

The label on the inactivity timeout warning modal's continue button to carry on the game.

Default = "Continue".

### timeoutAbortLabel

String.

The label on the inactivity timeout warning modal's abort button to exit on the game.

Default = "Exit".

## State

An List of type TestResult containing one TestResult per round.

See the TestResult object definition below.

## Outcomes

1 outcome will be used if defined: -

### OnComplete

This will trigger when a test is completed and all rounds have been completed.
Optional



## MovingDotClicker

![alt text](https://github.com/MarkWattsBoomi/HealthApp/blob/main/DotClicker.png)

### Functionality

Displays a canvas with a randomly appearing dot the user can click.

The time taken from dot appearance to click is recorded as is the accuracy of the touch point regards the dot's center

### Component Specific Attributes

#### numRounds

Number.

The number of times to display a clickable dot which makes up the complete test.

Default = 3.




## DurationClicker

![alt text](https://github.com/MarkWattsBoomi/HealthApp/blob/main/DotClicker.png)

### Functionality

Displays a canvas with a centered dot the user can click.

The dot is displayed for the nominated duration.

The user can click it as many times as they can in the given period.

Each click is recorded as a result with the accuracy of the touch point regards the dot's center and the time from test start of the click.

### Component Specific Attributes

#### durationSeconds

Number.

The maximum number of seconds to display the user clickable dot.

Default = "10".



## CountClicker

![alt text](https://github.com/MarkWattsBoomi/HealthApp/blob/main/DotClicker.png)

### Functionality

Displays a canvas with a centered dot the user can click along with a submit button.

The dot is displayed until the user clicks the submit button or clicks the dot the a specified maximum number of times.

Each click is recorded as a result with the accuracy of the touch point regards the dot's center and the time from test start of the click.

### Component Specific Attributes

#### clickLimit

Number.

The maximum number of clicks required to force complete the test bypassing the submit button.

Default = "10".



# ColourNames

![alt text](https://github.com/MarkWattsBoomi/HealthApp/blob/main/ColourNames.png)

# Functionality

Shows a random sequence of colour names drawn in random colours.  
The user is asked to indicate if the colour of the text matches the name of the colour.

## Component Attributes

### classes

Like all components, adding a "classes" attribute will cause that string to be added to the base container's class value.

### numRounds

Number.

The number of different colours to display which makes up the complete test.

Default = 3.

### countdownSeconds

Number.

The number of lead in seconds to count down at the start of the test and between rounds.

Default = 5.

### responseSeconds

Number.

The maximum number of seconds to wait for an answer before defaulting to a failure and moving to the next round.

Default = "-1" which means no timeout.

### startLabel

String.

The label to show on the startt button before a test begins.

Default = "Begin".

### correctLabel

String.

The label to show on the correct button whilst answering a round.

Default = "Correct".

## incorrectLabel

String.

The label to show on the incorrect button whilst answering a round.

Default = "Incorrect".


## Outcomes

1 outcome will be used if defined: -

### OnComplete

This will trigger when a test is completed and all rounds have been completed.
Optional

### State

An List of type TestResult containing one TestResult per round.

See the TestResult object definition below.


# MemoryBoxes

![alt text](https://github.com/MarkWattsBoomi/HealthApp/blob/main/MemoryBoxes.png)

# Functionality

Shows a 3 x 3 grid of boxes.

3 of the boxes will then turn yellow for a short period before turning blue again.

The user must then tag the ones which were yellow.


## Component Attributes

### classes

Like all components, adding a "classes" attribute will cause that string to be added to the base container's class value.

### numRounds

Number.

The number of different colours to display which makes up the complete test.

Default = 3.

### countdownSeconds

Number.

The number of lead in seconds to count down at the start of the test and between rounds.

Default = 2.

### flashSeconds

Number.

The number of seconds to reveal the yellow boxes.

Default = 4.

### responseSeconds

Number.

The maximum number of seconds to wait for an answer before defaulting to a failure and moving to the next round.

Default = "-1" which means no timeout.

### scoreSeconds

Number.

The number of seconds to show the user's selections vs the yellow squares shown.

Default = .

### startLabel

String.

The label to show on the startt button before a test begins.

Default = "Begin".



## Outcomes

1 outcome will be used if defined: -

### OnComplete

This will trigger when a test is completed and all rounds have been completed.
Optional

### State

An List of type TestResult containing one TestResult per round.

See the TestResult object definition below.




# Result Type Definition

All tests return an array of TestResult objects in the state.

Use this via the API tool to create the type: -

```
{
        "developerName": "TestResult",
        "developerSummary": "The result of a single test round",
        "elementType": "TYPE",
        "properties": [
            {
                "contentFormat": null,
                "contentType": "ContentNumber",
                "developerName": "round",
                "typeElementDeveloperName": null,
                "typeElementId": null
            },
            {
                "contentFormat": null,
                "contentType": "ContentNumber",
                "developerName": "correct",
                "typeElementDeveloperName": null,
                "typeElementId": null
            },
            {
                "contentFormat": null,
                "contentType": "ContentNumber",
                "developerName": "incorrect",
                 "typeElementDeveloperName": null,
                "typeElementId": null
            },
            {
                "contentFormat": null,
                "contentType": "ContentNumber",
                "developerName": "time",
                "typeElementDeveloperName": null,
                "typeElementId": null
            }
        ],
        "serviceElementDeveloperName": null,
        "serviceElementId": null
}
```


stimulousField