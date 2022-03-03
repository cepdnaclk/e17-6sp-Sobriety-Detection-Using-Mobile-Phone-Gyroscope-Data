# Continuous Authentication using Time-Series Mobile Phone Gyroscope Data to detect Sobriety

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Already Existing Approaches](#already-existing-approaches)
- [Our Approach](#our-approach)
- [What needs to be accomplished](#what-needs-to-be-accomplished)
- [ML Workflow](#ml-workflow)
    - [Data Gathering](#data-gathering)
    - [Data Cleaning & Preprocessing](#data-preprocessing)
    - [Data Segmenation](#data-segmenation)
    - [Feature Extraction](#feature-extraction)
    - [Training Classifiers](#training-classifiers)
    - [Evaluating Performance](#evaluating-performance)
- [Measuring the Success of the System](#measuring-the-success-of-the-system)
- [Results](#results)
- [Conclusion](#conclusion)
- [Our Team](#our-team)
- [References](#references)
- [Related Links](#related-links)

## Introduction

Alcohol is a substance that reduces the function of the brain, impairing thinking, reasoning, and muscle coordination. All these abilities are essential to operate a vehicle safely. Drinking alcohol can make us prone to accidents, both minor and serious, such as road traffic accidents, falls, drowning, poisoning and other unintentional injuries. In fact, just under one-third (29%) of all alcohol-attributable deaths are caused by unintentional injury. Following figures show some statistical data about deaths caused by drunk driving.

Source: Global status report on road safety 2015 |  Source: Sri Lanka Police (Sunday Observer, 13th February 2022)
:-------------------------:|:-------------------------:
<img src="docs/images/stat1.webp" width=100% />  |  <img src="docs/images/stat2.webp" width=100% />

An *e-scooter* or electric scooter is a stand-up scooter powered by an electric motor classified as a form of micro-mobility. Recently, electric kick scooters (e-scooters) have grown in popularity with the introduction of scooter-sharing systems that use apps allowing users to rent the scooters by the minute. The following is a picture of a dock of e-scooters just for the reference of the reader.

<img src="docs/images/e-scooter.jpg" width=100% />

A research done in the US evaluated 103 people who were admitted to ERs due to a scooter accident.

- 48 % of the patients tested for alcohol were way above the legal limit.
- 52 % of those assessed for drug use tested positive.

E-scooter drivers are prone to alcohol-fuelled risk taking, such as kerb jumping, the analysis of e-scooter injuries in the German city of Berlin revealed.

This project focuses on trying to solve the problem of drunk driving for *e-scooters* by **using mobile phone gyroscope data to detect sobriety and continuously authenticate the driver**.

## Already Existing Approaches

Drunk riding is a big problem with shared electric scooters. It’s just as illegal as drunk driving, but that hasn’t stopped scores of riders from engaging in the dangerous practice. [*Bird*](https://www.bird.co/) is one of the largest electric scooter sharing companies in the world. They have recently added an update to their scooter sharing app that requests the rider to type the word "SAFE" into the app before attempting to unlock a scooter. The goal is to give people a moment to pause and reflect on whether they are actually under the influence while attempting to rent an electric scooter.

<img src="docs/images/type-safe-bird.jpg" width=100% />

The electric scooter company [*Lime*](https://www.li.me/electric-scooter) has also taken a similar safety measure to avoid drunk riding. Those who are trying to rent a Lime after 10pm are asked to confirm they are capable of controlling the scooters. When the rider opens the app, a message pops up warning that drinking and riding is dangerous and illegal, and calls the user to ask themselves whether they're safe to ride. It requires the word "yes" to be in before the scooter will unlock.

Following is a drunk test concept for scooter sharing services that was found on dribble (source: https://dribbble.com/shots/11582376-Lime-Drunk-Test).

<img src="docs/images/drunk-test.gif" width=100% />

However, the above approaches aren't robust and reliable enough to avoid the problem of drunk riding.

## Our Approach

## What needs to be accomplished

## ML Workflow

## Measuring the Success of the System

## Our Team

<img src="./docs/images/team.png" width=100% />

## Related Links

[University of Peradeniya](https://www.pdn.ac.lk/academics/academics.php/)

[Faculty of Engineering](http://eng.pdn.ac.lk/)

[Department of Computer Engineering](http://www.ce.pdn.ac.lk/)