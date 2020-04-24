

export interface Poll {
  id?: string;
  owner_uid: string;

  title: string;
  is_open?: boolean;
  is_published?: boolean;
  is_promoted?: boolean;
  limit_votes?: boolean;
  date_created: number;
  choices?: Choice[];
  results?: Results;
  votes?: Vote[];
  vote_count: number;

  // options
  keep_open: boolean;
  winner_count: number;
  length: {
    end_time: number;
    display_count: number;
    display_units: string;
  };
  randomize_order: boolean;

  label: string;

  // call to action

  cta: {
    custom: boolean;
    label: string;
    url: string;
    html: string;
  };

  customizations: {
    logoUrl: string;
    barColor: string;
    color: string;
  };

  // hidden option
  is_public: boolean;
}

// export interface Choice {
//   label: string;
//   initial_order: number;
// }

// Choice is just a string for now, but may grow later.
export type Choice = string;

export interface Vote {
  id?: string;
  date_created?: number;
  ip_address: string;
  choices?: string[];
}

export interface Results {
  elected: string[];
  rounds: {
    [key: string]: number;
  }[];
  threshold: number;
}

export interface Description {
  headline: string;
  text: string;
  video_url: string;
}

// export interface Result {
//   percentages: number[];
//   label: string;
//   initial_order: number;
//   victory_round: number;
//   elimination_round: number;
// }
