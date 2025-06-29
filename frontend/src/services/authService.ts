import { User } from "../types";

// Simulate API delay
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

interface MockUser extends User {
  password: string;
}

const mockUsers: MockUser[] = [
  {
    id: "1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    avatar: "/api/avatars/admin.jpg"
  },
  {
    id: "2", 
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
    role: "manager",
    avatar: "/api/avatars/john.jpg"
  }
];

export const authAPI = {
  async login(email: string, password: string) {
    await delay(1000);
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    const token = btoa(JSON.stringify({ 
      userId: user.id, 
      email: user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));
    
    // Store in localStorage for persistence
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return {
      user: userWithoutPassword,
      token,
      expiresIn: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    };
  },

  async logout() {
    await delay(500);
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    return { success: true };
  },

  async refreshToken(token: string) {
    await delay(500);
    
    // Simulate token validation
    try {
      const decoded = JSON.parse(atob(token));
      
      if (decoded.exp < Date.now()) {
        throw new Error('Token expired');
      }
      
      const user = mockUsers.find(u => u.id === decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Generate new token
      const newToken = btoa(JSON.stringify({
        userId: user.id,
        email: user.email,
        exp: Date.now() + 24 * 60 * 60 * 1000
      }));
      
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        user: userWithoutPassword,
        token: newToken,
        expiresIn: 24 * 60 * 60 * 1000
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  async getCurrentUser() {
    await delay(300);
    
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('currentUser');
    
    if (!token || !userStr) {
      return null;
    }
    
    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.exp < Date.now()) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        return null;
      }
      
      return JSON.parse(userStr);
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return null;
    }
  },

  async updateProfile(userId: string | number, profileData: Partial<User>) {
    await delay(800);
    
    const userIndex = mockUsers.findIndex(u => u.id === String(userId));
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...profileData };
    
    const updatedUser = { ...mockUsers[userIndex] };
    const { password: _, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  },

  async changePassword(userId: string | number, currentPassword: string, newPassword: string) {
    await delay(800);
    
    const user = mockUsers.find(u => u.id === String(userId));
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }
    
    user.password = newPassword;
    
    return { success: true };
  },

  async resetPassword(email: string) {
    await delay(1200);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Simulate sending reset email
    const resetToken = btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      type: 'password_reset',
      exp: Date.now() + 60 * 60 * 1000 // 1 hour
    }));
    
    return {
      success: true,
      message: 'Password reset email sent',
      resetToken // In real app, this wouldn't be returned
    };
  },

  async confirmPasswordReset(resetToken: string, newPassword: string) {
    await delay(800);
    
    try {
      const decoded = JSON.parse(atob(resetToken));
      
      if (decoded.exp < Date.now()) {
        throw new Error('Reset token expired');
      }
      
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid token type');
      }
      
      const user = mockUsers.find(u => u.id === decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      user.password = newPassword;
      
      return { success: true };
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }
  }
};