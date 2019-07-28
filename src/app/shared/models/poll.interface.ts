

export interface Poll {
  id?: string;
  owner_uid: string;

  title: string;
  is_open?: boolean;
  is_promoted?: boolean;
  date_created: number;
  choices?: Choice[];
  results?: Result[];
  votes?: Vote[];
  vote_count: number;

  // options
  keep_open: boolean;
  winner_count: number;
  length: {
    end_time: number;
    display_count: number;
    display_units: string;
  }
  randomize_order: boolean;

  label: string;

  // call to action

  cta: {
    custom: boolean;
    label: string;
    url: string;
  }

  // hidden option
  is_public: boolean;
}

export interface Choice {
  label: string;
  initial_order: number;
}

export interface Vote {
  id?: string;
  date_created?:number;
  ip_address: string;
  choices?: Choice[];
}

export interface Result{
  percentages: number[];
  label: string;
  initial_order: number;
  victory_round: number;
  elimination_round: number;

}