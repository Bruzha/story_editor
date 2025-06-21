// app/export/page.tsx
'use client';

import { useSelector, useDispatch } from 'react-redux';
import Maket from '../../../components/sections/maket/Maket';
import Button from '../../../components/ui/button/Button';
import './style.scss';
import { AppDispatch, RootState } from '@/app/store';
import { useEffect } from 'react';
import { saveAs } from 'file-saver';
import * as docx from 'docx';
import { fetchProjectDataForExport } from '@/app/store/thunks/fetchProjectDataForExport';
import Loading from '@/app/components/ui/loading/Loading';
import Message from '@/app/components/ui/message/Message';
import JSZip from 'jszip';
import { clearProjectData } from '@/app/store/reducers/exportReducer';
import generateProjectContent from '../../../components/utils/generateProjectContent';
import generateCharacterContent from '../../../components/utils/generateCharacterContent';
import generateLocationContent from '../../../components/utils/generateLocationContent';
import generateObjectContent from '../../../components/utils/generateObjectContent';
import generatePlotLineContent from '../../../components/utils/generatePlotLineContent';
import generateTimelineEventContent from '../../../components/utils/generateTimelineEventContent';
import generateGroupContent from '../../../components/utils/generateGroupContent';
import generateNoteContent from '../../../components/utils/generateNoteContent';
import generateChapterContent from '../../../components/utils/generateChapterContent';
import Label from '@/app/components/ui/label/Label';
import generateChapterContent_Chapter from '@/app/components/utils/generateChapterContent_Chapter';
import createPageData from '@/backend/src/data/createPageData';
import generateTXTContent from '@/app/components/utils/generateTXTContent';
import generateChapterTXTContent from '@/app/components/utils/generateChapterTXTContent';

const cmToTwip = (cm: number) => {
  return Math.round(cm * 567);
};

const createDocxDocument = (content: docx.Paragraph[]): docx.Document => {
  return new docx.Document({
    numbering: {
      config: [
        {
          reference: 'my-crazy-numbering',
          levels: [
            {
              level: 0,
              format: 'decimal',
              text: '%1.',
              alignment: docx.AlignmentType.START,
            },
          ],
        },
      ],
    },
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 22, // 11pt
          },
          paragraph: {
            spacing: {
              line: 240, // 1.25
              after: 20 * 12, // Добавляем расстояние между абзацами
            },
            alignment: docx.AlignmentType.JUSTIFIED, // Выравнивание по ширине
            contextualSpacing: true, // Автоматическая расстановка переносов
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: 36, // 18pt
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 120,
              after: 120,
            },
          },
        },
        {
          id: 'Normal',
          name: 'Normal',
          quickFormat: true,
          paragraph: {
            spacing: {
              line: 240,
              after: 20 * 12, // Добавляем расстояние между абзацами
            },
            alignment: docx.AlignmentType.JUSTIFIED, // Выравнивание по ширине
            indent: { firstLine: cmToTwip(1.25) },
            contextualSpacing: true, // Автоматическая расстановка переносов
          },
          run: {
            font: 'Times New Roman',
            size: 22,
          },
        },
        {
          id: 'SectionHeader',
          name: 'Section Header',
          basedOn: 'Normal',
          quickFormat: true,
          run: {
            size: 28, // 14pt
            bold: true,
            color: '000000', // Black
          },
          paragraph: {
            alignment: docx.AlignmentType.CENTER,
            spacing: {
              before: 120,
              after: 120,
            },
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: cmToTwip(2),
              bottom: cmToTwip(2),
              left: cmToTwip(3),
              right: cmToTwip(3),
            },
          },
        },
        children: content,
        footers: {
          default: new docx.Footer({
            children: [
              new docx.Paragraph({
                alignment: docx.AlignmentType.CENTER,
                children: [
                  new docx.TextRun({
                    children: [docx.PageNumber.CURRENT],
                  }),
                ],
              }),
            ],
          }),
        },
      },
    ],
  });
};

const exportToDocxFile = async (doc: docx.Document, fileName: string, projectFolder: JSZip | null) => {
  const projectBlob = await docx.Packer.toBlob(doc);
  projectFolder?.file(`${fileName}.docx`, projectBlob);
};

export default function Export() {
  const subtitle = useSelector((state: RootState) => state.cards.subtitle);
  const projectId = useSelector((state: RootState) => state.project.projectId);
  const projectData = useSelector((state: RootState) => state.export.projectData);
  const loading = useSelector((state: RootState) => state.export.loading);
  const error = useSelector((state: RootState) => state.export.error);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (projectId && !projectData && !loading && !error) {
      dispatch(fetchProjectDataForExport(projectId));
    }
    return () => {
      dispatch(clearProjectData());
    };
  }, [projectId, dispatch]);

  const exportProjectToDocx = async (zip: JSZip) => {
    const projectName = projectData.project.info.name.value || 'Проект без названия';
    const projectFolder = zip.folder(projectName);
    const projectContent = generateProjectContent(projectData.project);
    const projectDoc = createDocxDocument(projectContent);
    await exportToDocxFile(projectDoc, projectName, projectFolder);
    return { projectFolder, projectName };
  };

  const exportStructureToDocx = async (projectFolder: JSZip | null) => {
    // Characters
    const charactersFolder = projectFolder?.folder('персонажи') || null;
    const characterPromises = projectData.characters.map(async (character: any) => {
      try {
        const characterContent = generateCharacterContent(character);
        const characterDoc = createDocxDocument(characterContent);
        const fileName = `${character.info.name.value || 'Персонаж без имени'} (${character.id})`;
        await exportToDocxFile(characterDoc, fileName, charactersFolder);
        return { status: 'fulfilled', value: fileName };
      } catch (error: any) {
        console.error('Error creating character DOCX:', error);
        return { status: 'rejected', reason: error };
      }
    });

    const characterResults = await Promise.allSettled(characterPromises);
    characterResults.forEach((result) => {
      if (result.status === 'rejected') {
        console.error('Character processing failed:', result.reason);
      }
    });

    // Locations
    const locationsFolder = projectFolder?.folder('локации') || null;
    const locationPromises = projectData.locations.map(async (location: any) => {
      try {
        const locationContent = generateLocationContent(location);
        const locationDoc = createDocxDocument(locationContent);
        const fileName = `${location.info.name.value || 'Локация без названия'} (${location.id})`;
        await exportToDocxFile(locationDoc, fileName, locationsFolder);
        return { status: 'fulfilled', value: fileName };
      } catch (error) {
        console.error('Error creating location DOCX:', error);
      }
    });
    await Promise.all(locationPromises);

    // Objects
    const objectsFolder = projectFolder?.folder('объекты') || null;

    const objectPromises = projectData.objects.map(async (object: any) => {
      try {
        const objectContent = generateObjectContent(object);
        const objectDoc = createDocxDocument(objectContent);
        const fileName = `${object.info.name.value || 'Объект без названия'} (${object.id})`;
        await exportToDocxFile(objectDoc, fileName, objectsFolder);
        return { status: 'fulfilled', value: fileName };
      } catch (error) {
        console.error('Error creating object DOCX:', error);
        return { status: 'rejected', reason: error };
      }
    });
    await Promise.all(objectPromises);

    // PlotLines
    const plotLinesFolder = projectFolder?.folder('сюжетные линии') || null;

    const plotLinesPromises = projectData.plotLines.map(async (plotLine: any) => {
      try {
        const plotLineContent = generatePlotLineContent(plotLine);
        const plotLineDoc = createDocxDocument(plotLineContent);
        const fileName = `${plotLine.info.name.value || 'Сюжетная линия без названия'} (${plotLine.id})`;
        await exportToDocxFile(plotLineDoc, fileName, plotLinesFolder);
        return { status: 'fulfilled', value: fileName };
      } catch (error: any) {
        console.error('Error creating plotLine DOCX:', error);
        return { status: 'rejected', reason: error };
      }
    });
    await Promise.allSettled(plotLinesPromises);

    // timeEvents
    const timeEventsFolder = projectFolder?.folder('события') || null;

    const timeEventsPromises = projectData.timeEvents.map(async (timeEvent: any) => {
      try {
        const timeEventContent = generateTimelineEventContent(timeEvent);
        const timeEventDoc = createDocxDocument(timeEventContent);
        const fileName = `${timeEvent.info.name.value || 'Событие без названия'} (${timeEvent.id})`;
        await exportToDocxFile(timeEventDoc, fileName, timeEventsFolder);
        return { status: 'fulfilled', value: fileName };
      } catch (error: any) {
        console.error('Error creating timeEvent DOCX:', error);
        return { status: 'rejected', reason: error };
      }
    });
    await Promise.allSettled(timeEventsPromises);

    // Groups
    const groupsFolder = projectFolder?.folder('группы') || null;

    const groupsPromises = projectData.groups.map(async (group: any) => {
      try {
        const groupContent = generateGroupContent(group);
        const groupDoc = createDocxDocument(groupContent);
        const fileName = `${group.info.name.value || 'Группа без названия'} (${group.id})`;
        await exportToDocxFile(groupDoc, fileName, groupsFolder);
        return { status: 'fulfilled', value: fileName };
      } catch (error: any) {
        console.error('Error creating group DOCX:', error);
        return { status: 'rejected', reason: error };
      }
    });

    await Promise.allSettled(groupsPromises);

    // Notes
    const notesFolder = projectFolder?.folder('заметки') || null;
    const notesPromises = projectData.notes.map(async (note: any) => {
      try {
        const noteContent = generateNoteContent(note);
        const noteDoc = createDocxDocument(noteContent);
        const fileName = `${note.info.title.value || 'Заметка без названия'} (${note.id})`;
        await exportToDocxFile(noteDoc, fileName, notesFolder);
        return { status: 'fulfilled', value: fileName };
      } catch (error: any) {
        console.error('Error creating note DOCX:', error);
        return { status: 'rejected', reason: error };
      }
    });
    await Promise.allSettled(notesPromises);
  };

  const exportToDocx = async () => {
    if (!projectData) return;
    const zip = new JSZip();
    try {
      const projectInfo = await exportProjectToDocx(zip);
      const { projectFolder, projectName } = projectInfo;
      const chaptersFolder = projectFolder?.folder('главы') || null;
      if (chaptersFolder) {
        const structureFolder = chaptersFolder.folder('структура');
        const contentFolder = chaptersFolder.folder('содержание');
        const structurePromises = projectData.chapters.map(async (chapter: any) => {
          try {
            const chapterContent = generateChapterContent(chapter);
            const chapterDoc = createDocxDocument(chapterContent);
            const fileName =
              `${chapter.info.order.value}. ${chapter.info.title.value} (${chapter.id})` ||
              `Глава без названия(${chapter.id})`;
            await exportToDocxFile(chapterDoc, fileName, structureFolder);
            return { status: 'fulfilled', value: fileName };
          } catch (error) {
            console.error('Error creating chapter structure DOCX:', error);
            return { status: 'rejected', reason: error };
          }
        });
        await Promise.allSettled(structurePromises);
        const contentPromises = projectData.chapters.map(async (chapter: any) => {
          try {
            const chapterContent = generateChapterContent_Chapter(chapter);
            const chapterDoc = createDocxDocument(chapterContent);
            const fileName =
              `${chapter.info.order.value}. ${chapter.info.title.value} (${chapter.id})` ||
              `Глава без названия(${chapter.id})`;
            await exportToDocxFile(chapterDoc, fileName, contentFolder);
            return { status: 'fulfilled', value: fileName };
          } catch (error) {
            console.error('Error creating chapter content DOCX:', error);
            return { status: 'rejected', reason: error }; // Indicate failure
          }
        });
        await Promise.allSettled(contentPromises);
      }

      await exportStructureToDocx(projectFolder);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${projectName}.zip`);
    } catch (error) {
      console.error('Error exporting to DOCX:', error);
    }
  };

  const exportProjectStructureToDocx = async () => {
    if (!projectData) return;
    const zip = new JSZip();
    try {
      const project = await exportProjectToDocx(zip);
      await exportStructureToDocx(project.projectFolder);
      // Chapters
      const chaptersFolder = project.projectFolder?.folder('главы') || null;
      const chapterPromises = projectData.chapters.map(async (chapter: any) => {
        try {
          const chapterContent = generateChapterContent(chapter);
          const chapterDoc = createDocxDocument(chapterContent);
          const fileName =
            `${chapter.info.order.value}. ${chapter.info.title.value} (${chapter.id})` ||
            `Глава без названия(${chapter.id})`;
          await exportToDocxFile(chapterDoc, fileName, chaptersFolder);
          return { status: 'fulfilled', value: fileName };
        } catch (error) {
          console.error('Error creating chapter DOCX:', error);
        }
      });
      await Promise.all(chapterPromises);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${project.projectName}.zip`);
    } catch (error) {
      console.error('Error exporting to DOCX:', error);
    }
  };

  const exportProjectChapterToDocx = async () => {
    if (!projectData) return;
    const zip = new JSZip();
    try {
      const projectName = projectData.project.info.name.value || 'Проект без названия';
      const projectFolder = zip.folder(projectName);

      // Chapters
      const chaptersFolder = projectFolder?.folder('главы') || null;
      const chapterPromises = projectData.chapters.map(async (chapter: any) => {
        try {
          const chapterContent = generateChapterContent_Chapter(chapter);
          const chapterDoc = createDocxDocument(chapterContent);
          const fileName =
            `${chapter.info.order.value}. ${chapter.info.title.value} (${chapter.id})` ||
            `Глава без названия(${chapter.id})`;
          await exportToDocxFile(chapterDoc, fileName, chaptersFolder);
          return { status: 'fulfilled', value: fileName };
        } catch (error) {
          console.error('Error creating chapter DOCX:', error);
        }
      });
      await Promise.all(chapterPromises);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${projectName}.zip`);
    } catch (error) {
      console.error('Error exporting to DOCX:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Message title={'ОШИБКА'} message={error} />;
  }

  const exportProjectStructureToTXT = async () => {
    if (!projectData) return;
    const zip = new JSZip();
    const projectName = projectData.project.info.name.value || 'Проект без названия';
    const projectFolder = zip.folder(projectName);

    if (projectFolder) {
      await dataToTXT(projectFolder, projectName);
      // Главы
      const chaptersFolder = projectFolder.folder('главы');
      if (chaptersFolder) {
        projectData.chapters.forEach((chapter: any) => {
          const masTitleChapter = createPageData.find((item) => item.type === 'chapters')?.masTitle || [];
          const chapterContent = generateTXTContent(chapter, masTitleChapter);
          chaptersFolder.file(`${chapter.info.order.value}_${chapter.info.title.value}.txt`, chapterContent);
        });
      }
    }

    // Генерируем ZIP-архив
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `${projectName}_Структура.zip`);
  };

  const exportProjectChapterToTXT = async () => {
    if (!projectData) return;
    const zip = new JSZip();
    const projectName = projectData.project.info.name.value || 'Проект без названия';
    const projectFolder = zip.folder(projectName);

    if (projectFolder) {
      // 2. Главы
      const chaptersFolder = projectFolder.folder('главы');
      if (chaptersFolder) {
        projectData.chapters.forEach((chapter: any) => {
          const chapterContent = generateChapterTXTContent(chapter);
          chaptersFolder.file(`${chapter.info.order.value}_${chapter.info.title.value}.txt`, chapterContent);
        });
      }
    }

    // Генерируем ZIP-архив
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `${projectName}_Структура.zip`);
  };

  const exportProjectAllToTXT = async () => {
    if (!projectData) return;
    const zip = new JSZip();
    const projectName = projectData.project.info.name.value || 'Проект без названия';
    const projectFolder = zip.folder(projectName);

    if (projectFolder) {
      await dataToTXT(projectFolder, projectName);

      // Главы
      const chaptersFolder = projectFolder.folder('главы');
      if (chaptersFolder) {
        const structureFolder = chaptersFolder.folder('структура');
        const contentFolder = chaptersFolder.folder('содержание');

        if (structureFolder && contentFolder) {
          projectData.chapters.forEach((chapter: any) => {
            const masTitleChapter = createPageData.find((item) => item.type === 'chapters')?.masTitle || [];
            const chapterStructureContent = generateTXTContent(chapter, masTitleChapter);
            structureFolder.file(
              `${chapter.info.order.value}_${chapter.info.title.value}_Структура.txt`,
              chapterStructureContent
            );
            const chapterContentContent = generateChapterTXTContent(chapter);
            contentFolder.file(
              `${chapter.info.order.value}_${chapter.info.title.value}_Содержание.txt`,
              chapterContentContent
            );
          });
        }
      }
    }

    // Генерируем ZIP-архив
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `${projectName}.zip`);
  };

  const dataToTXT = async (projectFolder: JSZip, projectName: string) => {
    // 1. Структура проекта
    const masTitleProject = createPageData.find((item) => item.type === 'projects')?.masTitle || [];
    const structureContent = generateTXTContent(projectData.project, masTitleProject);
    projectFolder.file(`${projectName}.txt`, structureContent);

    // 3. Персонажи
    const charactersFolder = projectFolder.folder('персонажи');
    if (charactersFolder) {
      projectData.characters.forEach((character: any) => {
        const masTitleCharacter = [
          ...(createPageData.find((item) => item.type === 'characters' && item.typePage === 'characters')?.masTitle ||
            []),
          ...(createPageData.find((item) => item.type === 'characters' && item.typePage === 'appearance')?.masTitle ||
            []),
          ...(createPageData.find((item) => item.type === 'characters' && item.typePage === 'personality')?.masTitle ||
            []),
          ...(createPageData.find((item) => item.type === 'characters' && item.typePage === 'social')?.masTitle || []),
        ];
        const characterContent = generateTXTContent(character, masTitleCharacter);
        charactersFolder.file(`${character.info.name.value}.txt`, characterContent);
      });
    }

    // 4. События
    const eventsFolder = projectFolder.folder('события');
    if (eventsFolder) {
      projectData.timeEvents.forEach((event: any) => {
        const masTitleEvent = createPageData.find((item) => item.type === 'time_events')?.masTitle || [];
        const eventContent = generateTXTContent(event, masTitleEvent);
        eventsFolder.file(`${event.info.name.value}.txt`, eventContent);
      });
    }

    // 5. Сюжетные линии
    const plotLinesFolder = projectFolder.folder('сюжетные линии');
    if (plotLinesFolder) {
      projectData.plotLines.forEach((plotLine: any) => {
        const masTitlePlotLine = createPageData.find((item) => item.type === 'plotLines')?.masTitle || [];
        const plotLineContent = generateTXTContent(plotLine, masTitlePlotLine);
        plotLinesFolder.file(`${plotLine.info.name.value}.txt`, plotLineContent);
      });
    }

    // 6. Объекты
    const objectsFolder = projectFolder.folder('объекты');
    if (objectsFolder) {
      projectData.objects.forEach((object: any) => {
        const masTitleObject = createPageData.find((item) => item.type === 'objects')?.masTitle || [];
        const objectContent = generateTXTContent(object, masTitleObject);
        objectsFolder.file(`${object.info.name.value}.txt`, objectContent);
      });
    }

    // 7. Группы
    const groupsFolder = projectFolder.folder('группы');
    if (groupsFolder) {
      projectData.groups.forEach((group: any) => {
        const masTitleGroup = createPageData.find((item) => item.type === 'groups')?.masTitle || [];
        const groupContent = generateTXTContent(group, masTitleGroup);
        groupsFolder.file(`${group.info.name.value}.txt`, groupContent);
      });
    }

    // 8. Заметки
    const notesFolder = projectFolder.folder('заметки');
    if (notesFolder) {
      projectData.notes.forEach((note: any) => {
        const masTitleNote = createPageData.find((item) => item.type === 'notes')?.masTitle || [];
        const noteContent = generateTXTContent(note, masTitleNote);
        notesFolder.file(`${note.info.title.value}.txt`, noteContent);
      });
    }

    // 9. Локации
    const locationsFolder = projectFolder.folder('локации');
    if (locationsFolder) {
      projectData.locations.forEach((location: any) => {
        const masTitleLocation = createPageData.find((item) => item.type === 'locations')?.masTitle || [];
        const locationContent = generateTXTContent(location, masTitleLocation);
        locationsFolder.file(`${location.info.name.value}.txt`, locationContent);
      });
    }
  };
  return (
    <>
      <Maket typeSidebar="project" title="ЭКСПОРТ" subtitle={subtitle}>
        <div className="export">
          <Label text={'Экспорт в TXT'}>
            <div className="export__buttons">
              <Button name="Произведение и структура проекта" onClick={exportProjectAllToTXT} />
              <Button name="Структура проекта" onClick={exportProjectStructureToTXT} />
              <Button name="Произведение" onClick={exportProjectChapterToTXT} />
            </div>
          </Label>
          <Label text={'Экспорт в DOCX'}>
            <div className="export__buttons">
              <Button name="Произведение и структура проекта" onClick={exportToDocx} />
              <Button name="Структура проекта" onClick={exportProjectStructureToDocx} />
              <Button name="Произведение" onClick={exportProjectChapterToDocx} />
            </div>
          </Label>
        </div>
      </Maket>
    </>
  );
}
