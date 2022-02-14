![Friend Advisor Logo](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_thumbnail_photos/001/834/632/datas/medium.png)
---
Planning events with friends just got easier! With just a few taps, you can create an event, invite friends, and share updates. Plus, you get reminders through notifications on your phone, so you never forget an important event again! Say goodbye to forgetting your significant other's anniversary or your mother's birthday.

We know that life can get busy, so we make it easy for you to stay on top of your plans. Plus, our app is avilable through both your internet browser or as an app on your mobile device. No more excuses!

Whether you're planning a birthday party, a weekend getaway, or just a night out, FriendAdvisor makes it easy for you and your friends to stay connected.

So what are you waiting for? 
### [Try out FriendAdvisor today!](https://friendadvisor.tech)

## Inspiration
Our team was inspired to create FriendAdvisor because coordinating events with a group of friends can be a huge hassle. You would have to send out group emails or texts to try and get everyone together, and then have to follow-up to make sure everyone got the message. And, if someone couldn't make it, then you would have to change the entire plan! 
That's why we built FriendAdvisor--a simple, yet elegant solution to coordinating and staying in the know for your upcoming events. 

## The Hackathon Theme
Additionally, we wanted to directly tackle the Hacklahoma theme, which is "unity/togetherness". This theme inspired us to think about how we can improve the unity in our lives, and we all decided that a big struggle with getting together with others is the process of planning and coordinating get-togethers.

We also entered the Domain.com challenge, as well as the Google Cloud challenge and Twilio challenge. Incorporating all of these systems into our project was difficult, but it definitely helped us learn a lot about using different APIs and making them interact with each other.

## What it does
With FriendAdvisor, you can:
- Easily create and join groups through a QR code or group ID
- Invite friends and family to your groups
- Create and manage group events all from one place
- View event details
- Receive  notifications on your phone about upcoming events
- And more!

## How we built it
We built the frontend using React with TypeScript, and Ionic so that FriendAdvisor works both in the web browser, and as a standalone mobile app.
On the backend, we used Node.js and Express for the main server code. Additionally, we used the Twilio API to send periodic text notifications about upcoming events to users.

We also many Google Cloud technologies such as:
- Firebase to authenticate and login users
- Monitoring to alert us to any site downtime, site traffic, and resource usage
- Firestore to act as our database
- Hosting to deploy our code to our [live website](https://friendadvisor.tech). 

## Challenges we ran into
Since it was our first time using the Twilio API, we had some trouble initially with authenticating our Twilio account, but after we got it setup, it was surprisingly easy to create and send messages.

Since many of us were new to using Firebase, it was a bit tricky to figure out how to create scheduled function through Firebase in order to periodically check if any events for users will be happening soon. It took a lot of trial and error and sifting through documentation, but we eventually got it to work like a charm!

A challenge we ran into on the frontend side of things was fixing the app so that content that hasn't yet been loaded will not be displayed to the user.

And finally, one of the biggest challenges we ran into was with limiting the scope of our project. There are so many ideas that we had, but just didn't have time to implement due to the time constraint of 24 hours.

## Accomplishments that we're proud of
We're very proud of the text notification system. Even though it was our first time using the Twilio API, we were able to implement personalized, periodic text notifications to each user in a group across any and all events.

## What we learned
Since it was the first time anyone on our team created a mobile app, we decided to use the Ionic framework, which allows us to code a mobile app just like we could with a website. We learned a lot about creating responsive web design so that our app works on any and every device.

We also learned about how to send texts through Twilio and how to schedule a function to periodically run with Firebase functions, all of which we were new to using.

## What's next for FriendAdvisor
We have many ideas for ways to extend the functionality of our app, including, but not limited to:
- Allowing users to customize when and how often they receive text notifications about upcoming events
- Integrating events with Google Calendar, Outlook, iOS Calendar, etc.
- Automatically creating an event from an event in an external calendar (e.g. Outlook).
- Allowing users to display all of their upcoming events through a calendar view. 
- Allowing users to automatically create an SMS group chat with the people in their FriendAdvisor groups
- Extending our login options, so users may login with through other services like Facebook or email.

---

[Link to Devpost](https://devpost.com/software/friendadvisor)
