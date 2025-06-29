import { mockUsers } from "./mockData";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  async login(email, password) {
    await delay(1000);
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }

    if (!user.isActive) {
      throw new Error("Compte désactivé");
    }

    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        permissions: user.permissions
      },
      token,
      expiresIn: 86400 // 24 hours
    };
  },

  async logout() {
    await delay(500);
    return { success: true };
  },

  async refreshToken(token) {
    await delay(500);
    
    // Simulate token validation
    if (!token || !token.startsWith('mock-jwt-token')) {
      throw new Error("Token invalide");
    }

    const newToken = `mock-jwt-token-refresh-${Date.now()}`;
    return {
      token: newToken,
      expiresIn: 86400
    };
  },

  async getCurrentUser() {
    await delay(500);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Non authentifié");
    }

    const userData = localStorage.getItem('user');
    if (!userData) {
      throw new Error("Données utilisateur manquantes");
    }

    return JSON.parse(userData);
  },

  async updateProfile(userId, profileData) {
    await delay(800);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error("Utilisateur non trouvé");
    }

    // Update mock user data
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...profileData };
    
    const updatedUser = { ...mockUsers[userIndex] };
    delete updatedUser.password;

    return updatedUser;
  },

  async changePassword(userId, currentPassword, newPassword) {
    await delay(800);
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (user.password !== currentPassword) {
      throw new Error("Mot de passe actuel incorrect");
    }

    // Update password in mock data
    user.password = newPassword;
    
    return { success: true };
  }
};