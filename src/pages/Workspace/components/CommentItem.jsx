export default function CommentItem({
  comment,
}) {
  return (
    <div className="workspace-comment">
      <div className="comment-avatar">
        {comment.initials}
      </div>

      <div className="comment-content">
        <div className="comment-header">
          <strong>
            {comment.author}
          </strong>

          <span>
            {comment.time}
          </span>
        </div>

        <p>
          {comment.content}
        </p>
      </div>
    </div>
  );
}