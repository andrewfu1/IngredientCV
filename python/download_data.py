import fiftyone as fo
import fiftyone.zoo as foz
import os
import shutil
import warnings
warnings.filterwarnings("ignore", category=UserWarning, message="Ignoring object with label")

classes = [
    'Apple',
    'Artichoke',
    'Banana',
    'Broccoli',
    'Cabbage',
    'Cantaloupe',
    'Carrot',
    'Cucumber',
    'Grape',
    'Mango',
    'Lemon',
    'Mushroom',
    'Pear',
    'Pineapple',
    'Pumpkin',
    'Strawberry',
    'Tomato',
    'Watermelon',
    'Orange'
]

dataset_root_dir = '/Users/andrewfu/documents/vscode/samples/dataset'

train_dataset_dir = os.path.join(dataset_root_dir, 'train')
val_dataset_dir = os.path.join(dataset_root_dir, 'val')
if os.path.exists(dataset_root_dir):
    shutil.rmtree(dataset_root_dir)
os.makedirs(train_dataset_dir)
os.makedirs(val_dataset_dir)


def download_and_export_datasets(split, export_dir, max_samples):

    datasets = []

    for class_name in classes:
        dataset = foz.load_zoo_dataset(
            "open-images-v7",
            split=split,
            label_types=["detections"],
            classes=[class_name],
            max_samples=max_samples,
            dataset_name=f"open-images-{class_name.lower()}-{split}"
        )
        datasets.append(dataset)

    background_samples = (max_samples * len(classes)) // 10
    background_classes = ["Chair", "Table", "Refrigerator", "Plant"]
    background_dataset = foz.load_zoo_dataset(
        "open-images-v7",
        split=split,
        label_types=["detections"],
        classes=background_classes,
        max_samples=background_samples * 2,
        dataset_name=f"open-images-background-{split}"
    )

    # Remove annotations from background images
    for sample in background_dataset:
        sample.clear_field("ground_truth")
        sample.save()

    num_detections = sum(len(sample.ground_truth.detections) for sample in background_dataset if sample.ground_truth is not None)
    print(f"Background dataset annotations after clearing: {num_detections}")

    # Trim backgrounds
    if len(background_dataset) > background_samples:
        background_dataset = background_dataset.take(background_samples)

    print(f"Number of background images downloaded: {len(background_dataset)}")

    datasets.append(background_dataset)

    # Print datasets for info
    for dataset in datasets:
        print(f"Dataset {dataset.name}: {len(dataset)} images")


    # Merge all datasets
    merged_dataset = fo.Dataset(name=f"open-images-{split}")
    for dataset in datasets:
        merged_dataset.add_samples(dataset)

    print(f"Total images in merged dataset: {len(merged_dataset)}")
    # Ensure ground_truth is not None before accessing detections
    total_annotations = sum(len(sample.ground_truth.detections) for sample in merged_dataset if sample.ground_truth is not None)
    print(f"Total annotations in merged dataset: {total_annotations}")

    # Export the dataset
    merged_dataset.export(
        export_dir=export_dir,
        dataset_type=fo.types.YOLOv5Dataset,
        label_field="ground_truth",
        classes=classes,
    )

    print(f"{split.capitalize()} dataset successfully exported to {export_dir}")

total_samples_train = 500 # number per class
total_samples_val = total_samples_train // 6

download_and_export_datasets("train", train_dataset_dir, max_samples=total_samples_train)
download_and_export_datasets("validation", val_dataset_dir, max_samples=total_samples_val)