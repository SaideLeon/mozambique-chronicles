import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Share2, Send, Loader2 } from 'lucide-react';
import { useAPI } from '../services/api';

const SocialInteractions = ({ chronicleId, isFeatured = false }) => {
//	alert("Chronicle ID: " + chronicleId);

  const [socialStats, setSocialStats] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const { social } = useAPI();

  useEffect(() => {
    fetchSocialStats();
  }, [chronicleId]);


  const fetchSocialStats = async () => {
    try {
      setIsLoading(true);
      const stats = await social.getChronicleStats(chronicleId, isFeatured);
      setSocialStats(stats);
    } catch (err) {
      setError('Erro ao carregar interações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
        setIsLoading(true);
        const commentData = {
            content: newComment,
            chronicle: chronicleId  // Make sure this is always present
        };
        await social.createComment(commentData);
        setNewComment('');
        fetchSocialStats();
    } catch (err) {
        setError('Erro ao enviar comentário');
    } finally {
        setIsLoading(false);
    }
};

  const handleLike = async () => {
    try {
      setIsLoading(true);
      if (socialStats.isLiked) {
        await social.unlike(socialStats.likeId);
      } else {
        await social.like({
          chronicle: isFeatured ? null : chronicleId,
          featured_chronicle: isFeatured ? chronicleId : null
        });
      }
      fetchSocialStats();
    } catch (err) {
      setError('Erro ao processar like');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (platform) => {
    try {
      const shareData = {
        platform,
        chronicle: isFeatured ? null : chronicleId,
        featured_chronicle: isFeatured ? chronicleId : null
      };
      await social.share(shareData);
      
      // Abrir URL de compartilhamento
      const shareUrls = social.getShareUrls(chronicleId, isFeatured);
      window.open(shareUrls[platform], '_blank');
    } catch (err) {
      setError('Erro ao compartilhar');
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
      {/* Barra de interações */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
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
        >
          <Heart className="w-5 h-5" fill={socialStats.isLiked ? 'currentColor' : 'none'} />
          <span>{socialStats.likesCount}</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span>{socialStats.sharesCount}</span>
          </button>

          {showShareOptions && (
            <div className="absolute bottom-full left-0 mb-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 space-y-2">
              {['facebook', 'twitter', 'whatsapp', 'telegram'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => handleShare(platform)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 rounded transition-colors capitalize"
                >
                  {platform}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Área de comentários */}
      {showComments && (
        <div className="space-y-4">
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isLoading || !newComment.trim()}
              className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>

          <div className="space-y-4">
            {socialStats.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4"
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
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
    </div>
  );
};

export default SocialInteractions;