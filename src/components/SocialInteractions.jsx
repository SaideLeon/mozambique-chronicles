import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Heart, Share2, Send, Loader2, X } from 'lucide-react';
import { useAPI } from '../services/api';

const SharePopover = ({ onShare, onClose }) => (
  <div className="absolute bottom-full left-0 mb-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 space-y-2 min-w-[140px]">
    <div className="flex justify-between items-center px-2 mb-2">
      <span className="text-sm font-medium text-gray-300">Compartilhar</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
        <X className="w-4 h-4" />
      </button>
    </div>
    {['facebook', 'twitter', 'whatsapp', 'telegram'].map((platform) => (
      <button
        key={platform}
        onClick={() => onShare(platform)}
        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 rounded transition-colors capitalize"
      >
        {platform}
      </button>
    ))}
  </div>
);

const CommentForm = ({ onSubmit, isLoading }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit(comment);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Escreva um comentário..."
        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 w-10
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent right-12"
      />
      <button
        type="submit"
        disabled={isLoading || !comment.trim()}
        className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:hover:bg-purple-500"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </form>
  );
};

const CommentList = ({ comments }) => (
  <div className="space-y-4 max-h-[400px] overflow-y-auto">
    {comments.map((comment) => (
      <div
        key={comment.id}
        className="bg-white/5 border border-white/10 rounded-lg p-4 transition-colors hover:bg-white/10"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="font-medium text-purple-400">{comment.author_name}</span>
          <span className="text-sm text-gray-500">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-300">{comment.content}</p>
      </div>
    ))}
  </div>
);

const SocialInteractions = ({ chronicleId, isFeatured = true }) => {
  const [socialStats, setSocialStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const { social } = useAPI();

  const fetchSocialStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await social.getChronicleStats(chronicleId, isFeatured);
      setSocialStats(stats);
    } catch (err) {
      setError('Erro ao carregar interações');
      console.error('Error fetching social stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [chronicleId, isFeatured, social]);

  useEffect(() => {
    fetchSocialStats();
  }, [fetchSocialStats]);

  const handleCommentSubmit = async (content) => {
    try {
      setIsLoading(true);
      setError(null);
      const commentData = {
        content,
        chronicle: chronicleId,
        featured_chronicle: isFeatured ? chronicleId : null
      };
      await social.createComment(commentData);
      await fetchSocialStats();
    } catch (err) {
      setError('Erro ao enviar comentário');
      console.error('Error submitting comment:', err);
    } finally {
      setIsLoading(false);
    }
  };
 const handleLike = async () => {
    if (isLoading) return;
    
    try {
        setIsLoading(true);
        setError(null);
        
        if (socialStats.isLiked) {
            await social.unlike(socialStats.likeId);
        } else {
            const likeData = {
                chronicle: isFeatured ? null : chronicleId,
                featured_chronicle: isFeatured ? chronicleId : null
            };
            await social.like(likeData);
        }
        
        // Atualiza os stats após o like/unlike
        await fetchSocialStats();
    } catch (err) {
        setError('Erro ao processar like');
        console.error('Error handling like:', err);
    } finally {
        setIsLoading(false);
    }
};
  

  const handleShare = async (platform) => {
    try {
      setError(null);
      const shareData = {
        platform,
        chronicle: isFeatured ? null : chronicleId,
        featured_chronicle: isFeatured ? chronicleId : null
      };
      await social.share(shareData);
      
      const shareUrls = social.getShareUrls(chronicleId, isFeatured);
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
      
      await fetchSocialStats();
    } catch (err) {
      setError('Erro ao compartilhar');
      console.error('Error sharing:', err);
    }
    setShowShareOptions(false);
  };

  if (!socialStats) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-6">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
          aria-label="Mostrar comentários"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{socialStats.commentsCount}</span>
        </button>

        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors ${
            socialStats.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
          disabled={isLoading}
          aria-label={socialStats.isLiked ? 'Remover like' : 'Dar like'}
        >
          <Heart 
            className={`w-5 h-5 transition-transform ${isLoading ? 'scale-90' : 'hover:scale-110'}`} 
            fill={socialStats.isLiked ? 'currentColor' : 'none'} 
          />
          <span>{socialStats.likesCount}</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
            aria-label="Opções de compartilhamento"
          >
            <Share2 className="w-5 h-5" />
            <span>{socialStats.sharesCount}</span>
          </button>

          {showShareOptions && (
            <SharePopover 
              onShare={handleShare} 
              onClose={() => setShowShareOptions(false)} 
            />
          )}
   </div>
      </div>

      {showComments && (
        <div className="space-y-4">
          <CommentForm onSubmit={handleCommentSubmit} isLoading={isLoading} />
          <CommentList comments={socialStats.comments} />
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default SocialInteractions;