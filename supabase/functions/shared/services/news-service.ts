
import { ServiceHandler, createSuccessResponse, createErrorResponse } from '../db-base.ts';

export class NewsService implements ServiceHandler {
  async handle(supabase: any, method: string, path: string, req: Request, user: any): Promise<Response> {
    console.log(`NewsService: Handling ${method} ${path}`);

    // GET /news - Get news articles
    if (method === 'GET' && path === '/news') {
      const url = new URL(req.url);
      const category = url.searchParams.get('category');
      return this.getNewsArticles(supabase, user, category);
    }

    // GET /news/:id - Get specific article
    if (method === 'GET' && path.startsWith('/news/')) {
      const articleId = path.split('/')[2];
      return this.getNewsArticleById(supabase, user, articleId);
    }

    // POST /news - Create news article (admin only)
    if (method === 'POST' && path === '/news') {
      const hasAdminRole = await this.checkAdminRole(supabase, user.id);
      if (!hasAdminRole) {
        return createErrorResponse('Unauthorized: Admin access required', 403);
      }
      
      const body = await req.json();
      return this.createNewsArticle(supabase, user, body);
    }

    // PUT /news/:id - Update news article (admin only)
    if (method === 'PUT' && path.startsWith('/news/')) {
      const hasAdminRole = await this.checkAdminRole(supabase, user.id);
      if (!hasAdminRole) {
        return createErrorResponse('Unauthorized: Admin access required', 403);
      }
      
      const articleId = path.split('/')[2];
      const body = await req.json();
      return this.updateNewsArticle(supabase, user, articleId, body);
    }

    return createErrorResponse('Method not allowed', 405);
  }

  private async checkAdminRole(supabase: any, userId: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .in('role', ['admin', 'content-admin']);
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  }

  private async getNewsArticles(supabase: any, user: any, category?: string): Promise<Response> {
    try {
      let query = supabase
        .from('news_articles')
        .select('*')
        .lte('start_date', new Date().toISOString())
        .gte('end_date', new Date().toISOString());

      if (category) {
        query = query.eq('category', category);
      }

      // Filter by visibility
      if (user) {
        query = query.or('visibility.eq.public,visibility.eq.private,visibility.eq.user_specific');
      } else {
        query = query.eq('visibility', 'public');
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching news articles:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in getNewsArticles:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async getNewsArticleById(supabase: any, user: any, articleId: string): Promise<Response> {
    try {
      let query = supabase
        .from('news_articles')
        .select('*')
        .eq('id', articleId);

      // Apply visibility filter
      if (user) {
        query = query.or('visibility.eq.public,visibility.eq.private,visibility.eq.user_specific');
      } else {
        query = query.eq('visibility', 'public');
      }

      const { data, error } = await query.single();
      
      if (error) {
        console.error('Error fetching news article by ID:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in getNewsArticleById:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async createNewsArticle(supabase: any, user: any, articleData: any): Promise<Response> {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .insert({
          ...articleData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating news article:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in createNewsArticle:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async updateNewsArticle(supabase: any, user: any, articleId: string, articleData: any): Promise<Response> {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .update({
          ...articleData,
          updated_at: new Date().toISOString()
        })
        .eq('id', articleId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating news article:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in updateNewsArticle:', error);
      return createErrorResponse('Internal server error');
    }
  }
}
