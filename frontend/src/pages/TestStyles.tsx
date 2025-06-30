import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Switch } from '../components/ui/switch';
import { Progress } from '../components/ui/progress';
import { 
  Palette, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Sparkles,
  Code,
  Eye,
  Heart,
  Star,
  Zap
} from 'lucide-react';

const TestStyles: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(65);

  return (
    <div className={`min-h-screen p-4 transition-all-smooth ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header animé */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            ✨ Dashboard Modern & Sexy ✨
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Interface responsive avec animations et design moderne
          </p>
          
          {/* Toggle dark mode */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="text-sm font-medium">Mode sombre</span>
            <Switch 
              checked={darkMode} 
              onCheckedChange={setDarkMode}
            />
          </div>
        </motion.div>

        {/* Statistiques en temps réel */}
        <div className="responsive-grid">
          {[
            { icon: Eye, label: 'Vues', value: '12.5K', trend: '+12%', color: 'blue' },
            { icon: Heart, label: 'Likes', value: '8.2K', trend: '+8%', color: 'red' },
            { icon: Star, label: 'Rating', value: '4.9', trend: '+0.2', color: 'yellow' },
            { icon: Zap, label: 'Performance', value: '98%', trend: '+5%', color: 'green' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="modern-card group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className={`text-sm font-medium text-${stat.color}-600`}>{stat.trend}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/20 group-hover:scale-110 transition-transform`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Progress bars animées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Progression du Projet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: 'Design System', progress: 90, color: 'blue' },
                { label: 'Responsive Design', progress: 85, color: 'green' },
                { label: 'Animations', progress: 75, color: 'purple' },
                { label: 'Performance', progress: 95, color: 'yellow' }
              ].map((item, index) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                    <span className="text-sm text-gray-500">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full bg-gradient-to-r from-${item.color}-400 to-${item.color}-600`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ delay: index * 0.2, duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Grid responsif avec effets Glass */}
        <div className="responsive-grid-2">
          
          {/* Card Glass Effect */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass border-white/20 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Glass Morphism
                </CardTitle>
                <CardDescription className="text-white/80">
                  Effet de verre moderne avec blur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full btn-gradient">
                  Bouton Glass
                </Button>
                <div className="space-y-2">
                  <div className="h-3 bg-white/20 rounded-full"></div>
                  <div className="h-3 bg-white/30 rounded-full w-3/4"></div>
                  <div className="h-3 bg-white/20 rounded-full w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card avec animations avancées */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="modern-card overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity" />
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Hover Effects
                </CardTitle>
                <CardDescription>
                  Survolez cette carte pour voir l'effet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Badge className="bg-pink-100 text-pink-800 hover:scale-105 transition-transform cursor-pointer">
                    Hover me
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 hover:scale-105 transition-transform cursor-pointer">
                    And me
                  </Badge>
                </div>
                <Button variant="outline" className="w-full group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 group-hover:text-white transition-all">
                  Button Magic
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Test des breakpoints responsifs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Monitor className="w-6 h-6" />
                Test Responsivité Avancé
              </CardTitle>
              <CardDescription>
                Grille adaptative selon la taille d'écran
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    className="h-16 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg hover:scale-105 transition-transform cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + (i * 0.05) }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {i + 1}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Guide de breakpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <Card className="modern-card border-l-4 border-blue-500">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Guide Responsive Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Smartphone className="w-8 h-8 text-green-600 mb-2" />
                  <h3 className="font-bold text-green-800 dark:text-green-400">Mobile</h3>
                  <p className="text-sm text-green-600 dark:text-green-300">&lt; 768px</p>
                  <p className="text-xs text-green-600 dark:text-green-300 mt-1">1-2 colonnes max</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Tablet className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="font-bold text-blue-800 dark:text-blue-400">Tablette</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300">768px - 1024px</p>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">2-4 colonnes</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Monitor className="w-8 h-8 text-purple-600 mb-2" />
                  <h3 className="font-bold text-purple-800 dark:text-purple-400">Desktop</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-300">&gt; 1024px</p>
                  <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">4+ colonnes</p>
                </div>
              </div>

              <Alert className="mt-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <strong>Fonctionnalités ajoutées :</strong> Animations fluides, effets de hover, 
                  mode sombre, glass morphism, gradients modernes, et responsivité parfaite !
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TestStyles;