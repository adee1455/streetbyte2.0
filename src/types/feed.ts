export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: string;
  user?: User;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  mediaUrls: string[];
  createdAt: string;
  likes: number;
  comments: Comment[];
  liked: boolean;
  saved: boolean;
  user?: User;
}

export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  createdAt: string;
  seen: boolean;
  user?: User;
} 