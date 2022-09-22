


export interface Respuesta<T> {
  data: T [];
  success: boolean;
  message: string[];
  pagination: Pagination;
}


export interface Event {
  id: number;
  e_name: string;
  e_img: string;
  e_descr: string;
  player_event: string;
}

export interface matchEvents
{
  e_id: number;
  player_id: number;
  match_id: number;
  ecount: number;
  minutes: string;
  t_id: number;
  id: number;
  player : Player
}



export interface Player
{
  id: number;
  first_name: string;
  last_name: string;
  nick: string;
  about: string;
  position_id: number;
 // def_img: number;
  team_id: number;
  //created_at: Date;
  //updated_at: Date;
  isSelected: boolean;
  player_number: number;
  image: string;
  extension: string;
  status: string;
  curp: string;
  
   //team: Team;
}

export interface PlayerArray {
  players: number[];
 
}

export interface MatchDay
{
  id: number;
  m_name: string;
  m_descr: string;
  s_id: number;
  is_playoff: string
}

export interface Match
{
  id: number;
  m_id: number;
  team1_id: number;
  team2_id: number;
  score1: number;
  score2: number;
  match_descr: string;
  published: string;
  is_extra: string;
  m_played: string;
  m_date: string;
  m_time: string;
  m_location: string;
  bonus1: string;
  bonus2: string;
  team1: Team;
  team2: Team
}
export interface Position
{
  p_id: number;
  p_name: string;
  ordering: number
}
export interface Season
{
  s_id: number;
  s_name: string;
  s_descr: string;
  s_rounds: number;
  t_id: number;
  published: string;
  s_win_point: string;
  s_lost_point: string;
  s_enbl_extra: number;
  s_extra_win: string;
  s_extra_lost: string;
  s_draw_point: string;
  s_groups: number;
  s_win_away: string;
  s_draw_away: string;
  s_lost_away: string;
  teams: number[];
  isSelected: boolean;
 
  //tournament: Tournament
}

export interface Team
{
  id: number;
  t_name: string;
  t_descr: string;
  t_yteam: string; // 0: No es mi equipo 1: Si es mi equipo
  def_img: number; // Imagen por default
  t_emblem?: string;
  t_city?: string;
  players?: Player[];
  isSelected: boolean;
}

export interface User {
 
  email: string;
  password: string;
}


export interface Pagination{

  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: [];
  next_page_url:string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number

}

export interface Photo{
  id: number;
  ph_name: string;
  ph_descr: string;
  ph_filename: string;
  imageStringBase64: string;
  extension: string;
}

<<<<<<< HEAD
 
=======

export interface Event {
  id: number;
  e_name: string;
  e_img: string;
  e_descr: string;
  player_event: string;
}

export interface matchEvents
{
  e_id: number;
  player_id: number;
  match_id: number;
  ecount: number;
  minutes: string;
  t_id: number;
  id: number;
  player : Player
}



export interface Player
{
  id: number;
  first_name: string;
  last_name: string;
  nick: string;
  about: string;
  position_id: number;
 // def_img: number;
  team_id: number;
  //created_at: Date;
  //updated_at: Date;
  isSelected: boolean;
  player_number: number;
  image: string;
  extension: string;
  status: string;
  curp: string;
  
   //team: Team;
}

export interface PlayerArray {
  players: number[];
 
}

export interface MatchDay
{
  id: number;
  m_name: string;
  m_descr: string;
  s_id: number;
  is_playoff: string
}

export interface Match
{
  id: number;
  m_id: number;
  team1_id: number;
  team2_id: number;
  score1: number;
  score2: number;
  match_descr: string;
  published: string;
  is_extra: string;
  m_played: string;
  m_date: string;
  m_time: string;
  m_location: string;
  bonus1: string;
  bonus2: string;
  team1: Team;
  team2: Team
}
export interface Position
{
  p_id: number;
  p_name: string;
  ordering: number
}

export interface Season
{
  s_id: number;
  s_name: string;
  s_descr: string;
  s_rounds: number;
  t_id: number;
  published: string;
  s_win_point: string;
  s_lost_point: string;
  s_enbl_extra: number;
  s_extra_win: string;
  s_extra_lost: string;
  s_draw_point: string;
  s_groups: number;
  s_win_away: string;
  s_draw_away: string;
  s_lost_away: string;
  teams: number[];
  isSelected: boolean;
 
  //tournament: Tournament
}

export interface Team
{
  id: number;
  t_name: string;
  t_descr: string;
  t_yteam: string; // 0: No es mi equipo 1: Si es mi equipo
  def_img: number; // Imagen por default
  t_emblem?: string;
  t_city?: string;
  players?: Player[];
  isSelected: boolean;
}

export interface User {
  email: string;
  username:  string;
  password: string;
}


export interface Pagination{

  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: [];
  next_page_url:string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number

}

export interface Photo{
  id: number;
  ph_name: string;
  ph_descr: string;
  ph_filename: string;
  imageStringBase64: string;
  extension: string;
}

>>>>>>> 4b2b3790254d0039962978897e9d927751802a3e
