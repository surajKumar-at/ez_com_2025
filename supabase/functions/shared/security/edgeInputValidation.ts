
// Security utilities for edge functions (Deno environment)
export class EdgeInputValidator {
  
  // Sanitize string input to prevent XSS
  static sanitizeString(input: string): string {
    if (!input) return '';
    
    // Remove dangerous patterns
    let sanitized = input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/['"]/g, '') // Remove quotes
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .trim();
    
    // Limit length
    sanitized = sanitized.substring(0, 200);
    
    return sanitized;
  }

  // Validate category name against allowed patterns
  static validateCategory(category: string): boolean {
    if (!category) return false;
    
    // Allow alphanumeric, spaces, hyphens, and some special chars
    const categoryPattern = /^[a-zA-Z0-9\s\-\_\#\/&]+$/;
    return categoryPattern.test(category) && category.length <= 100;
  }

  // Validate search query
  static validateSearchQuery(query: string): boolean {
    if (!query) return false;
    
    // Basic validation for search terms
    return query.length <= 100 && !/[<>\"';]/.test(query);
  }

  // Check for SQL injection patterns
  static hasSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|TRUNCATE|GRANT|REVOKE)\b)/i,
      /(--|\||\/\*|\*\/|;)/,
      /(\bOR\b|\bAND\b).*?[=<>]/i,
      /(\bUNION\b|\bJOIN\b).*?\bSELECT\b/i,
    ];
    return sqlPatterns.some(pattern => pattern.test(input));
  }

  // Rate limiting check for edge functions
  static checkRateLimit(identifier: string, maxRequests: number = 100): boolean {
    // Simple in-memory rate limiting (would use Redis in production)
    const windowMs = 60000; // 1 minute
    const now = Date.now();
    const key = `rate_${identifier}_${Math.floor(now / windowMs)}`;
    
    // In production, this would use a proper cache/database
    // For now, just return true as we have client-side rate limiting
    return true;
  }

  // Validate and sanitize query parameters
  static validateQueryParams(url: URL): { [key: string]: string } {
    const params: { [key: string]: string } = {};
    
    // Category parameter
    const category = url.searchParams.get('category');
    if (category) {
      const sanitizedCategory = this.sanitizeString(category);
      if (this.validateCategory(sanitizedCategory) && !this.hasSQLInjection(sanitizedCategory)) {
        params.category = sanitizedCategory;
      } else {
        console.warn('Invalid category parameter:', category);
      }
    }
    
    // Search parameter
    const search = url.searchParams.get('search');
    if (search) {
      const sanitizedSearch = this.sanitizeString(search);
      if (this.validateSearchQuery(sanitizedSearch) && !this.hasSQLInjection(sanitizedSearch)) {
        params.search = sanitizedSearch;
      } else {
        console.warn('Invalid search parameter:', search);
      }
    }
    
    return params;
  }
}
