# Rankit

Wrong: This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.2.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.7

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Development notes
- Rankit is built with Angular. For search and social share purposes, we need to be able to deliver it to a server. As a result, we use Angular's Server Side Rendering (SSR).
- Google's domain for this is https://rankit-vote.appspot.com/
- Hosting is [Google Cloud App Engine](https://console.cloud.google.com/home/dashboard?project=rankit-vote)
- Database is [Firebase](https://console.firebase.google.com/u/0/project/rankit-vote/overview)
- Billing is through Google Cloud
- We use Firebase cloud functions for the backend. They're within this project under `/functions` and live on Firebase. Since we use Typescript for them, they need to be compiled to JS before being uploaded.

## Editing the home page
- within Firebase, there is a admin "table" with "settings" and a few fields hardcoded. You can edit those as necessary.

## Deploy Functions
(Assumes you're set up with the Firebase SDK)
`cd functions` > `npm run build`
`firebase deploy --only functions`

## Deploy Main app
`npm run deploy`

Deploying builds the application and uploads it to Google Cloud's App Engine using the `gcloud` [SDK](https://cloud.google.com/sdk/docs/install). 
