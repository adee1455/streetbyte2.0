import { User, Post, Story, Comment } from '@/types/feed';
import { v4 as uuidv4 } from 'uuid';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    username: 'alexj',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '2',
    name: 'Samantha Lee',
    username: 'samlee',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '3',
    name: 'Mike Chen',
    username: 'mikechen',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    username: 'emmaw',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '5',
    name: 'David Kim',
    username: 'davidk',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

export const currentUser: User = {
  id: '0',
  name: 'You',
  username: 'currentuser',
  avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150',
};

export const mockStories: Story[] = [
  {
    id: '1',
    userId: '1',
    mediaUrl: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    seen: false,
  },
  {
    id: '2',
    userId: '2',
    mediaUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    seen: false,
  },
  {
    id: '3',
    userId: '3',
    mediaUrl: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    seen: true,
  },
  {
    id: '4',
    userId: '4',
    mediaUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    seen: false,
  },
  {
    id: '5',
    userId: '5',
    mediaUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    seen: true,
  },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    userId: '2',
    text: 'This looks absolutely delicious! 😍',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    postId: '1',
    userId: '3',
    text: 'Where is this place? I need to try it!',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    postId: '2',
    userId: '1',
    text: 'The plating is so beautiful!',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '4',
    postId: '3',
    userId: '4',
    text: 'I was just there last week! Amazing food.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    content: 'Just discovered this amazing ramen spot in downtown! The broth was so rich and flavorful. #foodie #ramen #downtown',
    mediaUrls: [
      'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likes: 42,
    comments: mockComments.filter(comment => comment.postId === '1'),
    liked: false,
    saved: false,
  },
  {
    id: '2',
    userId: '2',
    content: 'Best avocado toast in the city! The poached eggs were perfect. 🥑 #brunch #avocadotoast',
    mediaUrls: [
      'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: 78,
    comments: mockComments.filter(comment => comment.postId === '2'),
    liked: true,
    saved: false,
  },
  {
    id: '3',
    userId: '3',
    content: 'This new fusion restaurant is blowing my mind! Check out these creative dishes. @emmaw you need to try this place! #fusion #foodporn',
    mediaUrls: [
      'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    likes: 124,
    comments: mockComments.filter(comment => comment.postId === '3'),
    liked: false,
    saved: true,
  },
  {
    id: '4',
    userId: '4',
    content: 'Homemade pasta night was a success! Made everything from scratch including the sauce. #homecooking #pasta #italian',
    mediaUrls: [
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    likes: 56,
    comments: [],
    liked: false,
    saved: false,
  },
];

// Helper function to get enriched data with user information
export const getEnrichedStories = () => {
  return mockStories.map(story => ({
    ...story,
    user: mockUsers.find(user => user.id === story.userId),
  }));
};

export const getEnrichedPosts = () => {
  return mockPosts.map(post => ({
    ...post,
    user: mockUsers.find(user => user.id === post.userId),
    comments: post.comments.map(comment => ({
      ...comment,
      user: mockUsers.find(user => user.id === comment.userId),
    })),
  }));
};

// Helper function to create a new post
export const createPost = (content: string, mediaUrls: string[]) => {
  const newPost: Post = {
    id: uuidv4(),
    userId: currentUser.id,
    content,
    mediaUrls,
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [],
    user: currentUser,
    liked: false,
    saved: false,
  };
  
  mockPosts.unshift(newPost);
  return newPost;
};

// Helper function to create a new story
export const createStory = (mediaUrl: string) => {
  const newStory: Story = {
    id: uuidv4(),
    userId: currentUser.id,
    mediaUrl,
    createdAt: new Date().toISOString(),
    seen: false,
    user: currentUser,
  };
  
  mockStories.unshift(newStory);
  return newStory;
};

// Helper function to add a comment to a post
export const addComment = (postId: string, text: string) => {
  const newComment: Comment = {
    id: uuidv4(),
    postId,
    userId: currentUser.id,
    text,
    createdAt: new Date().toISOString(),
    user: currentUser,
  };
  
  // Don't modify the mock data directly
  return newComment;
};

export const fetchPosts = async (): Promise<Post[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockPosts;
}; 