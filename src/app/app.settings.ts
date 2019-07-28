
import { Poll } from './shared/models/poll.interface';


export class AppSettings {

    public static owner_uid = 'sdfjsdlkfj';

    public static lengths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    // public static validScores = [15, 5, 3, 1, 0];

    public static defaultText = {
      "votingSubtitle": "Vote for your top choices by tapping on each in order of your preference. You can reorder them before submitting your vote.",
      "successTitle": "Ranked choice voting is for every election!",
      "successBody": "Ranked choice voting (RCV) makes democracy more fair and functional. It works in a variety of contexts. With ranked choice voting, voters can rank as many candidates as they want in order of choice. Candidates do best when they attract a strong core of first-choice support while also reaching out for second and even third choices.",
      "successButtonLabel": "Bring RCV to My Community",
      "successButtonUrl": "https://www.fairvote.org" 

    }

    public static defaultPoll:Poll = {
      "id": "",
      "owner_uid": "",
      "title": "", 
      "date_created": 0,
      "is_open": true,
      "choices": [
        {"label": "", "initial_order" : 0},
        {"label": "", "initial_order" : 1},
        {"label": "", "initial_order" : 2},
      ], 
      "votes": [],
      "vote_count": 0,
      "keep_open": true,
      "winner_count": 1,
      "length": {
        "end_time": 0,
        "display_count": 7,
        "display_units": "days"
      },
      "randomize_order": true,
      "label": "choice",
      "cta": {
        "custom": false,
        "label": "Bring RCV to My Community",
        "url": "https://www.fairvote.org/"
      },
      "is_public": false
     
    
      
    }
}


// export interface Poll {
//   id?: string;
//   owner_uid: string;

//   title: string;
//   choices?: Choice[];
//   votes?: Vote[];
//   vote_count: number;

//   // options
//   keep_open: boolean;
//   winner_count: number;
//   length: {
//     end_time: number;
//     display_count: number;
//     display_units: number;
//   }
//   randomize_order: boolean;

//   label: string;

//   // call to action

//   cta: {
//     label: string;
//     url: string;
//   }

//   // hidden option
//   is_public: boolean;
// }