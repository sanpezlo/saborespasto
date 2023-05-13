import { useEditDishContext } from "@/context/EditDish";
import { useQuickviewsContext } from "@/context/Quickviews";
import { DishAndCategories } from "@/types/DishAndCategories";
import { StarIcon } from "@heroicons/react/20/solid";

export function Dishes({
  dishes,
  isAdmin = false,
}: {
  dishes: DishAndCategories[];
  isAdmin?: boolean;
}) {
  const { setQuickviewsModal } = useQuickviewsContext();
  const { setEditDishModal } = useEditDishContext();

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Platos
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {dishes.map((dish) => (
          <div key={dish.id} className="group relative">
            <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:h-80">
              <img
                src={dish.image}
                alt={dish.description}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full group-hover:opacity-75"
              />
              <div className="absolute flex items-end justify-center opacity-0 focus:opacity-100 group-hover:opacity-100">
                <div className="m-4 w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-sm text-black  text-center">
                  {isAdmin ? "Editar" : "Vista rápida"}
                </div>
              </div>
            </div>
            <div className="flex mt-2 flex-wrap gap-2">
              {dish.CategoriesInDishes.map((categoryInDish) => (
                <div
                  key={categoryInDish.id}
                  className="text-xs rounded-full bg-gray-200 px-3 py-1.5 font-medium text-gray-600"
                >
                  {categoryInDish.category.name}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <button
                    onClick={() =>
                      isAdmin
                        ? setEditDishModal({ dish })
                        : setQuickviewsModal({ dish })
                    }
                  >
                    <span aria-hidden="true" className="absolute inset-0" />
                    {dish.name}
                  </button>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{dish.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {dish.price && dish.price - dish.new_price > 0 && (
                    <span className="text-red-500 line-through">
                      ${dish.price.toLocaleString("es-Co")}
                    </span>
                  )}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  ${dish.new_price.toLocaleString("es-Co")}
                </p>
              </div>
            </div>
            <div className="flex items-center mt-2">
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  className={`${
                    4 > rating ? "text-indigo-600" : "text-gray-200"
                  } h-5 w-5 flex-shrink-0`}
                  aria-hidden="true"
                />
              ))}
              <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                4.95 de 5
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
