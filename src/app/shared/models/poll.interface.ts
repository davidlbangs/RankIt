

export interface Poll {
  id?: string;
  uid: string;

  title: string;
  choices: Choice[];
  votes: Vote[];
  vote_count: number;

  // options
  keep_open: boolean;
  winner_count: number;
  length: {
    end_time: number;
    display_count: number;
    display_units: number;
  }
  randomize_order: boolean;

  label: string;

  // call to action
  cta_label: string;
  cta_link: string;
}

export interface Choice {
  id: string;
  label: string;
}

export interface Vote {
  date_created?:string;

}