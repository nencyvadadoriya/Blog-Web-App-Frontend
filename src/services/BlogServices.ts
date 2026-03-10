import toast from 'react-hot-toast';
import { authService } from '../services/AuthService';
import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://blog-web-app-iota.vercel.app/api/';

class BlogServices {
  baseUrl = API_BASE_URL;
  blogUrl = 'blog';
  userProfileUrl = 'user/user_profile';
  userUrl = 'user';
  token = authService.getAuthToken();

  private async tryGet<T = any>(paths: string[]) {
    let lastErr: any;
    for (const p of paths) {
      try {
        const res = await axios.get(this.baseUrl + p, this.blogHeader());
        return res.data as T;
      } catch (e: any) {
        lastErr = e;
        const status = e?.response?.status;
        if (status && status !== 404) break;
      }
    }
    throw lastErr;
  }

  blogHeader() {
    return {
      headers: {
        Authorization: `Bearer ${authService.getAuthToken()}` 
      }
    };
  }

  async blogAddUrl(data: FormData) {
    try {
      // Log the FormData contents for debugging
      console.log('BlogServices.blogAddUrl - FormData entries:');
      for (let [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}:`, value.name, value.type, value.size);
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      const token = authService.getAuthToken();
      console.log('BlogServices.blogAddUrl - Token exists:', !!token);
      console.log('BlogServices.blogAddUrl - Request URL:', this.baseUrl + this.blogUrl + '/addBlog');

      const authToken = authService.getAuthToken();
      if (!authToken) {
        toast.error('Session expired. Please login again.');
        throw new Error('Missing auth token');
      }

      const res = await axios.post(this.baseUrl + this.blogUrl + '/addBlog', data, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return res.data;
    } catch (err) {
      console.error('Add Blog Error: ', err);
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const msg =
          (err.response?.data as any)?.msg ||
          (err.response?.data as any)?.message ||
          err.message ||
          'Failed to add blog';
        
        console.error('Add Blog Axios Error Details:', {
          status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers
        });
        
        if (status === 401) {
          toast.error('Session expired. Please login again.');
        } else {
          toast.error(msg);
        }
      } else {
        toast.error('Failed to add blog');
      }
      throw err;
    }
  }

  async updateBlog(blogId: string, data: FormData) {
    try {
      const authToken = authService.getAuthToken();
      if (!authToken) {
        toast.error('Session expired. Please login again.');
        throw new Error('Missing auth token');
      }

      const res = await axios.put(this.baseUrl + this.blogUrl + '/' + blogId, data, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return res.data;
    } catch (err) {
      console.error('Update Blog Error: ', err);
      toast.error('Failed to update blog');
      throw err;
    }
  }

  async deleteBlog(blogId: string) {
    try {
      const res = await axios.delete(
        this.baseUrl + this.blogUrl + '/' + blogId,
        this.blogHeader()
      );
      return res.data;
    } catch (err) {
      console.error('Delete Blog Error: ', err);
      toast.error('Failed to delete blog');
      throw err;
    }
  }

  async fetchAllBlogs() {
    try {
      const res = await axios.get(
        this.baseUrl + this.blogUrl,
        this.blogHeader()
      );
      return res.data;
    } catch (err) {
      console.error('Fetch All Blog: ', err);
      toast.error('Something went wrong !!');
    }
  }

  async fetchCurrentUserBlogs() {
    const res = await axios.get(this.baseUrl + this.blogUrl + '/current/user/blogs', this.blogHeader());
    return res.data;
  }

  async fetchFollowingBlogs() {
    const res = await axios.get(this.baseUrl + this.blogUrl + '/following', this.blogHeader());
    return res.data;
  }

  async fetchSinglBlog(blogId: string) {
    try {
      const res = await axios.get(
        this.baseUrl + this.blogUrl + '/' + blogId,
        this.blogHeader()
      );
      return res.data;
    } catch (err) {
      console.error('Fetch Single Blog: ', err);
      toast.error('Something went wrong !!');
    }
  }

  async likeBlog(blogId: string, like: boolean) {
    try {
      const res = await axios.get(
        this.baseUrl + this.blogUrl + '/' + blogId + '/likes',
        {
          ...this.blogHeader(),
          params: {
            like: String(like)
          }
        }
      );
      return res.data;
    } catch (err) {
      console.error('Like Blog Error: ', err);
      toast.error('Failed to like blog');
      throw err;
    }
  }

  async addBlogComment(blogId: string, msg: string) {
    try {
      const res = await axios.post(
        this.baseUrl + this.blogUrl + '/' + blogId + '/comment',
        { msg },
        this.blogHeader()
      );
      return res.data;
    } catch (err) {
      console.error('Add Comment Error: ', err);
      toast.error('Failed to add comment');
      throw err;
    }
  }

  async fetchUserProfile() {
    try {
      const res = await axios.get(
        this.baseUrl + this.userProfileUrl,
        this.blogHeader()
      );
      return res.data;
    } catch (err) {
      console.error('Fetch User Profile : ', err);
      toast.error('Something went wrong..');
    }
  }

  async updateProfile(data: { name?: string; email?: string; about?: string; profile_image?: string }, userId: string) {
    try {
      console.log('API URL:', this.baseUrl + this.userUrl + '/user_update/' + userId);
      const res = await axios.put(
        this.baseUrl + this.userUrl + '/user_update/' + userId,
        data,
        this.blogHeader()
      );
      return res.data;
    } catch (err: any) {
      console.error('Update Profile Error: ', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update profile';
      toast.error(errorMsg);
      throw err;
    }
  }

  async getFollowers() {
    const res = await axios.get(this.baseUrl + this.userUrl + '/followers', this.blogHeader());
    return res.data;
  }

  async getFollowing() {
    const res = await axios.get(this.baseUrl + this.userUrl + '/following', this.blogHeader());
    return res.data;
  }

  async followUser(userId: string) {
    const res = await axios.post(this.baseUrl + this.userUrl + '/follow/' + userId, {}, this.blogHeader());
    return res.data;
  }

  async unfollowUser(userId: string) {
    const res = await axios.post(this.baseUrl + this.userUrl + '/unfollow/' + userId, {}, this.blogHeader());
    return res.data;
  }

  async toggleSavedBlog(blogId: string) {
    const res = await axios.post(this.baseUrl + this.userUrl + '/saved/' + blogId + '/toggle', {}, this.blogHeader());
    return res.data;
  }

  async getSavedBlogs() {
    const res = await axios.get(this.baseUrl + this.userUrl + '/saved', this.blogHeader());
    return res.data;
  }

  async shareBlogToUsers(blogId: string, toUserIds: string[]) {
    const res = await axios.post(
      this.baseUrl + this.userUrl + '/share',
      { blogId, toUserIds },
      this.blogHeader()
    );
    return res.data;
  }

  async getShareInbox() {
    const res = await axios.get(this.baseUrl + this.userUrl + '/share/inbox', this.blogHeader());
    return res.data;
  }

  async searchUsers(q: string) {
    const res = await axios.get(this.baseUrl + this.userUrl + '/search', {
      ...this.blogHeader(),
      params: { q }
    });
    return res.data;
  }

  async getUserById(userId: string) {
    return this.tryGet([
      `${this.userUrl}/${userId}`,
      `${this.userProfileUrl}/${userId}`,
      `${this.userUrl}/user_profile/${userId}`
    ]);
  }

  async getUserBlogs(userId: string) {
    return this.tryGet([
      `${this.blogUrl}/user/${userId}`,
      `${this.blogUrl}/user/blogs/${userId}`,
      `${this.blogUrl}/${userId}/blogs`
    ]);
  }

  async getUserFollowers(userId: string) {
    return this.tryGet([
      `${this.userUrl}/${userId}/followers`,
      `${this.userUrl}/followers/${userId}`
    ]);
  }

  async getUserFollowing(userId: string) {
    return this.tryGet([
      `${this.userUrl}/${userId}/following`,
      `${this.userUrl}/following/${userId}`
    ]);
  }
}

export const blogService = new BlogServices();
