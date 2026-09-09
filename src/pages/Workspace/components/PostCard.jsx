import {
  FiExternalLink,
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiSend,
} from "react-icons/fi";

import { useState } from "react";

import CommentItem from "./CommentItem";

export default function PostCard({
  post,
  type,
  onLike,
  onComment,
}) {
  const [commentsOpen, setCommentsOpen] =
    useState(false);

  const [comment, setComment] =
    useState("");

  function handleSubmitComment(event) {
    event.preventDefault();

    if (!comment.trim()) {
      return;
    }

    onComment(post.id, comment);

    setComment("");
    setCommentsOpen(true);
  }

  return (
    <article className="workspace-post-card">
      <div className="post-header">
        <div className="post-author-area">
          <div className="post-avatar">
            {post.author.initials}
          </div>

          <div>
            <strong>
              {post.author.name}
            </strong>

            <span>
              {post.createdAt}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="post-more-button"
          aria-label="Mais opções"
        >
          <FiMoreHorizontal />
        </button>
      </div>

      <div className="post-body">
        <span
          className={`post-type post-type-${type.className}`}
        >
          {type.label}
        </span>

        <p className="post-text">
          {post.content}
        </p>

        {post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {post.linkedItem && (
          <button
            type="button"
            className="linked-content"
          >
            <div>
              <span>
                CONTEÚDO VINCULADO
              </span>

              <strong>
                {post.linkedItem.title}
              </strong>
            </div>

            <FiExternalLink />
          </button>
        )}
      </div>

      <div className="post-actions">
        <button
          type="button"
          className={
            post.liked
              ? "post-action post-action-liked"
              : "post-action"
          }
          onClick={() => onLike(post.id)}
        >
          <FiHeart />

          <span>
            {post.likes}
          </span>
        </button>

        <button
          type="button"
          className="post-action"
          onClick={() =>
            setCommentsOpen(
              (previous) => !previous
            )
          }
        >
          <FiMessageCircle />

          <span>
            {post.comments.length}
          </span>
        </button>

        <span className="post-action-label">
          {post.comments.length === 1
            ? "1 comentário"
            : `${post.comments.length} comentários`}
        </span>
      </div>

      {commentsOpen && (
        <div className="post-thread">
          {post.comments.length > 0 && (
            <div className="thread-comments">
              {post.comments.map(
                (comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                  />
                )
              )}
            </div>
          )}

          <form
            className="comment-form"
            onSubmit={handleSubmitComment}
          >
            <div className="comment-avatar comment-avatar-small">
              IR
            </div>

            <div className="comment-input">
              <input
                type="text"
                placeholder="Escreva uma resposta..."
                value={comment}
                onChange={(event) =>
                  setComment(
                    event.target.value
                  )
                }
              />

              <button
                type="submit"
                aria-label="Enviar comentário"
              >
                <FiSend />
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}