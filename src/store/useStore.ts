import { create } from 'zustand';
import { Post, Story, User, Comment } from '@/types/feed';
import { getEnrichedPosts, getEnrichedStories, createPost, createStory, addComment, currentUser } from '@/data/mockData';

interface StoreState {
  posts: Post[];
  stories: Story[];
  currentUser: typeof currentUser;
  currentStoryIndex: number;
  currentStoryUserId: string | null;
  isStoryModalOpen: boolean;
  isPostUploadModalOpen: boolean;
  isCommentModalOpen: boolean;
  currentPostId: string | null;
  isAddStoryModalOpen: boolean;
  
  // Actions
  fetchPosts: () => void;
  fetchStories: () => void;
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  addNewComment: (postId: string, text: string) => Comment;
  addNewPost: (content: string, mediaUrls: string[]) => Post;
  addNewStory: (mediaUrl: string) => Story;
  openStoryModal: (userId: string) => void;
  closeStoryModal: () => void;
  nextStory: () => void;
  prevStory: () => void;
  openPostUploadModal: () => void;
  closePostUploadModal: () => void;
  openCommentModal: (postId: string) => void;
  closeCommentModal: () => void;
  openAddStoryModal: () => void;
  closeAddStoryModal: () => void;
  markStorySeen: (storyId: string) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  posts: [],
  stories: [],
  currentUser,
  currentStoryIndex: 0,
  currentStoryUserId: null,
  isStoryModalOpen: false,
  isPostUploadModalOpen: false,
  isCommentModalOpen: false,
  currentPostId: null,
  isAddStoryModalOpen: false,
  
  fetchPosts: () => {
    set({ posts: getEnrichedPosts() });
  },
  
  fetchStories: () => {
    set({ stories: getEnrichedStories() });
  },
  
  toggleLikePost: (postId: string) => {
    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === postId) {
          const liked = !post.liked;
          return {
            ...post,
            liked,
            likes: liked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      })
    }));
  },
  
  toggleSavePost: (postId: string) => {
    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            saved: !post.saved
          };
        }
        return post;
      })
    }));
  },
  
  addNewComment: (postId: string, text: string) => {
    const newComment = addComment(postId, text);
    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === postId) {
          // Check if comment already exists
          const commentExists = post.comments.some(comment => comment.id === newComment.id);
          if (commentExists) {
            return post;
          }
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    }));
    return newComment;
  },
  
  addNewPost: (content: string, mediaUrls: string[]) => {
    const newPost = createPost(content, mediaUrls);
    set(state => ({
      posts: [newPost, ...state.posts]
    }));
    return newPost;
  },
  
  addNewStory: (mediaUrl: string) => {
    const newStory = createStory(mediaUrl);
    set(state => ({
      stories: [newStory, ...state.stories]
    }));
    return newStory;
  },
  
  openStoryModal: (userId: string) => {
    const { stories } = get();
    const userStories = stories.filter(story => story.userId === userId);
    const userIndex = stories.findIndex(story => story.userId === userId);
    
    if (userStories.length > 0) {
      set({ 
        isStoryModalOpen: true, 
        currentStoryUserId: userId,
        currentStoryIndex: userIndex >= 0 ? userIndex : 0
      });
    }
  },
  
  closeStoryModal: () => {
    set({ 
      isStoryModalOpen: false, 
      currentStoryUserId: null,
      currentStoryIndex: 0
    });
  },
  
  nextStory: () => {
    const { stories, currentStoryIndex } = get();
    if (currentStoryIndex < stories.length - 1) {
      set({ currentStoryIndex: currentStoryIndex + 1 });
    } else {
      set({ isStoryModalOpen: false });
    }
  },
  
  prevStory: () => {
    const { currentStoryIndex } = get();
    if (currentStoryIndex > 0) {
      set({ currentStoryIndex: currentStoryIndex - 1 });
    }
  },
  
  openPostUploadModal: () => {
    set({ isPostUploadModalOpen: true });
  },
  
  closePostUploadModal: () => {
    set({ isPostUploadModalOpen: false });
  },
  
  openCommentModal: (postId: string) => {
    set({ 
      isCommentModalOpen: true,
      currentPostId: postId
    });
  },
  
  closeCommentModal: () => {
    set({ 
      isCommentModalOpen: false,
      currentPostId: null
    });
  },
  
  openAddStoryModal: () => {
    set({ isAddStoryModalOpen: true });
  },
  
  closeAddStoryModal: () => {
    set({ isAddStoryModalOpen: false });
  },
  
  markStorySeen: (storyId: string) => {
    set(state => ({
      stories: state.stories.map(story => {
        if (story.id === storyId) {
          return {
            ...story,
            seen: true
          };
        }
        return story;
      })
    }));
  }
})); 