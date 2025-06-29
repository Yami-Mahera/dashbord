import React from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';

const TestStyles: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Test des Styles CSS</h1>
          <p className="text-gray-600">Vérification de l'application des styles Tailwind et responsivité</p>
        </div>

        {/* Grid responsif */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-600">Composants UI</CardTitle>
              <CardDescription>Test des composants Shadcn/UI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                Bouton Principal
              </Button>
              <Button variant="outline" className="w-full">
                Bouton Outline
              </Button>
              <Input placeholder="Input de test" className="w-full" />
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-600">Badges & Alerts</CardTitle>
              <CardDescription>Test des badges et alertes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              <Alert>
                <AlertDescription>
                  Ceci est une alerte de test pour vérifier les styles.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-purple-600">Responsive Design</CardTitle>
              <CardDescription>Test de la responsivité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded"></div>
                <div className="h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded"></div>
                <div className="h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test de responsivité avec breakpoints */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">Test Responsivité</CardTitle>
            <CardDescription>Les éléments changent selon la taille d'écran</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i}
                  className="h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test des gradients et couleurs */}
        <Card className="shadow-lg bg-gradient-to-r from-pink-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Gradients & Couleurs
            </CardTitle>
            <CardDescription>Test des dégradés et variables CSS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="h-24 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                Primary
              </div>
              <div className="h-24 bg-secondary rounded-lg flex items-center justify-center text-secondary-foreground font-bold">
                Secondary
              </div>
              <div className="h-24 bg-accent rounded-lg flex items-center justify-center text-accent-foreground font-bold">
                Accent
              </div>
              <div className="h-24 bg-muted rounded-lg flex items-center justify-center text-muted-foreground font-bold">
                Muted
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions de test */}
        <Card className="shadow-lg border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-600">Instructions de Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• <strong>Desktop (>1024px):</strong> Devrait afficher 3 colonnes dans la grille principale</p>
              <p>• <strong>Tablette (768-1024px):</strong> Devrait afficher 2 colonnes dans la grille principale</p>
              <p>• <strong>Mobile (<768px):</strong> Devrait afficher 1 colonne dans la grille principale</p>
              <p>• Tous les gradients et couleurs devraient être visibles</p>
              <p>• Les boutons devraient avoir des effets hover</p>
              <p>• Les cartes devraient avoir des ombres qui changent au hover</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestStyles;