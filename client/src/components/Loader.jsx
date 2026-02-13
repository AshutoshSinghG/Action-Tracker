export default function Loader({ text = 'Processing...' }) {
    return (
        <div className="loader-overlay">
            <div className="spinner" />
            <span className="loader-text">{text}</span>
        </div>
    );
}
