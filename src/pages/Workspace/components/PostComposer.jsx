import { FiPlus } from "react-icons/fi";

export default function PostComposer({
    onOpen,
}) {
    return (
        <div className="workspace-new-post-area">
            <button
                type="button"
                className="workspace-new-post-button"
                onClick={() =>
                    onOpen("update")
                }
            >
                <FiPlus />

                NOVA PUBLICAÇÃO
            </button>
        </div>
    );
}