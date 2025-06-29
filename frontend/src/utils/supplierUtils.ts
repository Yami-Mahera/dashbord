import { Supplier, SupplierFilters } from "../types/supplier.types";

export class SupplierUtils {
  /**
   * Formate le nom d'affichage d'un fournisseur
   */
  static getDisplayName(supplier: Supplier): string {
    return `${supplier.name} (${supplier.code})`;
  }

  /**
   * Obtient le contact principal d'un fournisseur
   */
  static getPrimaryContact(supplier: Supplier) {
    return (
      supplier.contacts.find((contact) => contact.isPrimary) ||
      supplier.contacts[0]
    );
  }

  /**
   * Formate l'adresse complète
   */
  static getFullAddress(supplier: Supplier): string {
    const { address } = supplier;
    return `${address.street}, ${address.city} ${address.postalCode}, ${address.country}`;
  }

  /**
   * Calcule le score de performance d'un fournisseur
   */
  static calculatePerformanceScore(supplier: Supplier): number {
    // Logique de calcul basée sur les critères de performance
    let score = 100;

    // Pénalité pour délai de livraison élevé
    if (supplier.delivery_time > 30) {
      score -= 20;
    } else if (supplier.delivery_time > 15) {
      score -= 10;
    }

    // Bonus pour conditions de paiement favorables
    if (supplier.payment_terms <= 30) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Filtre les fournisseurs selon les critères
   */
  static filterSuppliers(
    suppliers: Supplier[],
    filters: SupplierFilters
  ): Supplier[] {
    return suppliers.filter((supplier) => {
      // Filtre par recherche textuelle
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          supplier.name.toLowerCase().includes(searchTerm) ||
          supplier.code.toLowerCase().includes(searchTerm) ||
          supplier.category.toLowerCase().includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // Filtre par catégorie
      if (filters.category && supplier.category !== filters.category) {
        return false;
      }

      // Filtre par statut
      if (filters.status && supplier.status !== filters.status) {
        return false;
      }

      // Filtre par ville
      if (filters.city && supplier.address.city !== filters.city) {
        return false;
      }

      // Filtre par pays
      if (filters.country && supplier.address.country !== filters.country) {
        return false;
      }

      return true;
    });
  }

  /**
   * Trie les fournisseurs
   */
  static sortSuppliers(
    suppliers: Supplier[],
    sortBy: keyof Supplier = "name",
    sortOrder: "asc" | "desc" = "asc"
  ): Supplier[] {
    return [...suppliers].sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      // Gestion spéciale pour les dates
      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      // Gestion pour les chaînes de caractères
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Valide les données d'un fournisseur
   */
  static validateSupplier(supplier: Partial<Supplier>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!supplier.name?.trim()) {
      errors.push("Le nom du fournisseur est requis");
    }

    if (!supplier.code?.trim()) {
      errors.push("Le code du fournisseur est requis");
    }

    if (!supplier.category?.trim()) {
      errors.push("La catégorie est requise");
    }

    if (!supplier.address?.street?.trim()) {
      errors.push("L'adresse est requise");
    }

    if (!supplier.address?.city?.trim()) {
      errors.push("La ville est requise");
    }

    if (!supplier.address?.postalCode?.trim()) {
      errors.push("Le code postal est requis");
    }

    if (!supplier.address?.country?.trim()) {
      errors.push("Le pays est requis");
    }

    if (supplier.payment_terms !== undefined && supplier.payment_terms < 0) {
      errors.push("Les conditions de paiement doivent être positives");
    }

    if (supplier.delivery_time !== undefined && supplier.delivery_time < 0) {
      errors.push("Le délai de livraison doit être positif");
    }

    // Validation des contacts
    if (supplier.contacts && supplier.contacts.length > 0) {
      supplier.contacts.forEach((contact, index) => {
        if (!contact.name?.trim()) {
          errors.push(`Le nom du contact ${index + 1} est requis`);
        }
        if (!contact.email?.trim() || !this.isValidEmail(contact.email)) {
          errors.push(`L'email du contact ${index + 1} est invalide`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valide un email
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Génère un code fournisseur automatique
   */
  static generateSupplierCode(
    name: string,
    existingCodes: string[] = []
  ): string {
    // Prendre les 3 premières lettres du nom, en majuscules
    const baseCode = name
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 3)
      .toUpperCase()
      .padEnd(3, "X");

    let code = baseCode;
    let counter = 1;

    // Vérifier l'unicité et ajouter un numéro si nécessaire
    while (existingCodes.includes(code)) {
      code = `${baseCode}${counter.toString().padStart(2, "0")}`;
      counter++;
    }

    return code;
  }

  /**
   * Exporte les fournisseurs en CSV
   */
  static exportToCSV(suppliers: Supplier[]): string {
    const headers = [
      "Code",
      "Nom",
      "Catégorie",
      "Adresse",
      "Ville",
      "Code Postal",
      "Pays",
      "Contact Principal",
      "Email",
      "Téléphone",
      "Conditions de Paiement",
      "Délai de Livraison",
      "Statut",
    ];

    const rows = suppliers.map((supplier) => {
      const primaryContact = this.getPrimaryContact(supplier);
      return [
        supplier.code,
        supplier.name,
        supplier.category,
        supplier.address.street,
        supplier.address.city,
        supplier.address.postalCode,
        supplier.address.country,
        primaryContact?.name || "",
        primaryContact?.email || "",
        primaryContact?.phone || "",
        supplier.payment_terms.toString(),
        supplier.delivery_time.toString(),
        supplier.status || "active",
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    return csvContent;
  }

  /**
   * Obtient les statistiques des fournisseurs
   */
  static getSupplierStats(suppliers: Supplier[]) {
    const total = suppliers.length;
    const active = suppliers.filter((s) => s.status === "active").length;
    const inactive = suppliers.filter((s) => s.status === "inactive").length;
    const pending = suppliers.filter((s) => s.status === "pending").length;

    const categories = suppliers.reduce((acc, supplier) => {
      acc[supplier.category] = (acc[supplier.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const countries = suppliers.reduce((acc, supplier) => {
      acc[supplier.address.country] = (acc[supplier.address.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgDeliveryTime =
      suppliers.length > 0
        ? suppliers.reduce((sum, s) => sum + s.delivery_time, 0) /
          suppliers.length
        : 0;

    const avgPaymentTerms =
      suppliers.length > 0
        ? suppliers.reduce((sum, s) => sum + s.payment_terms, 0) /
          suppliers.length
        : 0;

    return {
      total,
      active,
      inactive,
      pending,
      categories,
      countries,
      avgDeliveryTime: Math.round(avgDeliveryTime),
      avgPaymentTerms: Math.round(avgPaymentTerms),
    };
  }
}
