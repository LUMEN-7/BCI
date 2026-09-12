import {
    FiCheckCircle,
    FiExternalLink,
    FiSend,
    FiUser,
    FiX,
} from "react-icons/fi";

import { useState } from "react";

import CommentItem from "./CommentItem";

export default function ThreadDrawer({
    post,
    type,

    onClose,
    onComment,
    onStatusChange,
}) {
    const [comment, setComment] =
        useState("");

    if (!post) {
        return null;
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!comment.trim()) {
            return;
        }

        onComment(
            post.id,
            comment
        );

        setComment("");
    }

    return (
        <>
            <div
                className="thread-overlay"
                onClick={onClose}
            />

            <aside className="thread-drawer">
                <header className="thread-drawer-header">
                    <div>
                        <span>
                            DISCUSSÃO
                        </span>

                        <h2>
                            Thread
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar thread"
                    >
                        <FiX />
                    </button>
                </header>

                <div className="thread-drawer-body">

                    <div className="thread-original-post">
                        <div className="thread-author">
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

                        <span
                            className={`post-type post-type-${type.className}`}
                        >
                            {type.label}
                        </span>

                        <p>
                            {post.content}
                        </p>

                        {post.tags?.length > 0 && (
                            <div className="post-tags">
                                {post.tags.map(
                                    (tag) => (
                                        <span key={tag}>
                                            #{tag}
                                        </span>
                                    )
                                )}
                            </div>
                        )}

                        {post.responsible && (
                            <div className="thread-responsible">
                                <FiUser />

                                <div>
                                    <span>
                                        RESPONSÁVEL
                                    </span>

                                    <strong>
                                        {post.responsible}
                                    </strong>
                                </div>
                            </div>
                        )}

                        {post.status && (
                            <div className="thread-status-area">
                                <span>
                                    STATUS
                                </span>

                                <select
                                    value={post.status}
                                    onChange={(event) =>
                                        onStatusChange(
                                            post.id,
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="pending">
                                        Pendente
                                    </option>

                                    <option value="progress">
                                        Em análise
                                    </option>

                                    <option value="resolved">
                                        Resolvido
                                    </option>
                                </select>
                            </div>
                        )}

                        {post.linkedItem && (
                            <button
                                type="button"
                                className="thread-linked-item"
                            >
                                <div>
                                    <span>
                                        CONTEÚDO VINCULADO
                                    </span>

                                    <strong>
                                        {
                                            post.linkedItem
                                                .title
                                        }
                                    </strong>
                                </div>

                                <FiExternalLink />
                            </button>
                        )}
                    </div>

                    <div className="thread-divider">
                        <span>
                            DISCUSSÃO
                        </span>

                        <strong>
                            {post.comments.length}
                        </strong>
                    </div>

                    <div className="thread-drawer-comments">
                        {post.comments.length ===
                            0 ? (
                            <div className="thread-empty">
                                <FiCheckCircle />

                                <strong>
                                    Nenhum comentário ainda
                                </strong>

                                <span>
                                    Seja a primeira pessoa a
                                    participar dessa discussão.
                                </span>
                            </div>
                        ) : (
                            post.comments.map(
                                (item) => (
                                    <CommentItem
                                        key={item.id}
                                        comment={item}
                                    />
                                )
                            )
                        )}
                    </div>
                </div>

                <form
                    className="thread-drawer-form"
                    onSubmit={handleSubmit}
                >
                    <div className="comment-avatar">
                        IR
                    </div>

                    <div>
                        <textarea
                            value={comment}
                            placeholder="Escreva uma resposta..."
                            onChange={(event) =>
                                setComment(
                                    event.target.value
                                )
                            }
                        />

                        <button
                            type="submit"
                            aria-label="Enviar resposta"
                        >
                            <FiSend />
                        </button>
                    </div>
                </form>
            </aside>
        </>
    );
}