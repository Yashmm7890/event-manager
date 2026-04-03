export interface EventFormValues {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  category: string;
}

export interface Event extends EventFormValues {
  id: number;
}

export interface PaginatedEventsResponse {
  data: Event[];
  last_page: number;
}
