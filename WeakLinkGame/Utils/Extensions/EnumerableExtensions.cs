namespace Utils.Extensions;

public static class EnumerableExtensions
{
    public static T GetNext<T>(this IList<T> list, T currentItem) where T : class
    {
        if (currentItem is null) throw new ArgumentNullException(nameof(currentItem));
        var indexOf = list.IndexOf(currentItem);
        return list[indexOf == list.Count - 1 ? 0 : indexOf + 1];
    }
}