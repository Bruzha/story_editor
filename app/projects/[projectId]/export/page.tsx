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
import generateProjectContent from './generateContent/generateProjectContent';
import generateCharacterContent from './generateContent/generateCharacterContent';
import generateLocationContent from './generateContent/generateLocationContent';
import generateObjectContent from './generateContent/generateObjectContent';
import generatePlotLineContent from './generateContent/generatePlotLineContent';
import generateTimelineEventContent from './generateContent/generateTimelineEventContent';
import generateGroupContent from './generateContent/generateGroupContent';
import generateNoteContent from './generateContent/generateNoteContent';

const cmToTwip = (cm: number) => {
  return Math.round(cm * 567);
};

// 2. Function to create DOCX document
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

// 3. Function to export DOCX document
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

    // Clear projectData when projectId changes
    return () => {
      dispatch(clearProjectData());
    };
  }, [projectId, dispatch]);

  const exportToDocx = async () => {
    if (!projectData) return;

    try {
      const zip = new JSZip();
      const projectName = projectData.project.info.name.value || 'Project';
      const projectFolder = zip.folder(projectName);

      // 1. Project DOCX
      const projectContent = generateProjectContent(projectData.project);
      const projectDoc = createDocxDocument(projectContent);
      await exportToDocxFile(projectDoc, projectName, projectFolder);

      // 2. Characters DOCX
      const charactersFolder = projectFolder?.folder('characters') || null;
      const characterPromises = projectData.characters.map(async (character: any) => {
        try {
          const characterContent = generateCharacterContent(character);
          const characterDoc = createDocxDocument(characterContent);
          await exportToDocxFile(characterDoc, character.info.name.value || 'Character', charactersFolder);
          return { status: 'fulfilled', value: character.info.name.value || 'Character' }; // Indicate success
        } catch (error: any) {
          console.error('Error creating character DOCX:', error);
          return { status: 'rejected', reason: error }; // Indicate failure
        }
      });

      const characterResults = await Promise.allSettled(characterPromises);
      characterResults.forEach((result) => {
        if (result.status === 'rejected') {
          console.error('Character processing failed:', result.reason);
        }
      });

      // 3. Locations DOCX
      const locationsFolder = projectFolder?.folder('locations') || null;
      const locationPromises = projectData.locations.map(async (location: any) => {
        try {
          const locationContent = generateLocationContent(location);
          const locationDoc = createDocxDocument(locationContent);
          await exportToDocxFile(locationDoc, location.info.name.value || 'Location', locationsFolder);
          return { status: 'fulfilled', value: location.info.name.value || 'Location' }; // Indicate success
        } catch (error) {
          console.error('Error creating location DOCX:', error);
        }
      });
      await Promise.all(locationPromises); // Wait for all locations to be processed

      // 4. Objects DOCX
      const objectsFolder = projectFolder?.folder('objects') || null; // Create objects folder

      const objectPromises = projectData.objects.map(async (object: any) => {
        // Iterate through objects
        try {
          const objectContent = generateObjectContent(object); // Generate content
          const objectDoc = createDocxDocument(objectContent); // Create document
          await exportToDocxFile(objectDoc, object.info.name.value || 'Object', objectsFolder); // Export document
          return { status: 'fulfilled', value: object.info.name.value || 'Object' }; // Indicate success
        } catch (error) {
          console.error('Error creating object DOCX:', error);
          return { status: 'rejected', reason: error }; // Indicate failure
        }
      });
      await Promise.all(objectPromises); // Wait for all locations to be processed

      // 5. PlotLines DOCX
      const plotLinesFolder = projectFolder?.folder('plotLines') || null;

      const plotLinesPromises = projectData.plotLines.map(async (plotLine: any) => {
        try {
          const plotLineContent = generatePlotLineContent(plotLine);
          const plotLineDoc = createDocxDocument(plotLineContent);
          await exportToDocxFile(plotLineDoc, plotLine.info.name.value || 'PlotLine', plotLinesFolder);
          return { status: 'fulfilled', value: plotLine.info.name.value || 'PlotLine' }; // Indicate success
        } catch (error: any) {
          console.error('Error creating plotLine DOCX:', error);
          return { status: 'rejected', reason: error }; // Indicate failure
        }
      });
      await Promise.allSettled(plotLinesPromises);

      // 6. timeEvents DOCX
      const timeEventsFolder = projectFolder?.folder('time_events') || null;

      const timeEventsPromises = projectData.timeEvents.map(async (timeEvent: any) => {
        try {
          const timeEventContent = generateTimelineEventContent(timeEvent);
          const timeEventDoc = createDocxDocument(timeEventContent);
          await exportToDocxFile(timeEventDoc, timeEvent.info.name.value || 'Событие', timeEventsFolder);
          return { status: 'fulfilled', value: timeEvent.info.name.value || 'Событие' }; // Indicate success
        } catch (error: any) {
          console.error('Error creating timeEvent DOCX:', error);
          return { status: 'rejected', reason: error }; // Indicate failure
        }
      });
      await Promise.allSettled(timeEventsPromises);

      // 5. Groups DOCX
      const groupsFolder = projectFolder?.folder('groups') || null; // Обработка null

      const groupsPromises = projectData.groups.map(async (group: any) => {
        try {
          const groupContent = generateGroupContent(group);
          const groupDoc = createDocxDocument(groupContent);
          await exportToDocxFile(groupDoc, group.info.name.value || 'Group', groupsFolder);
          return { status: 'fulfilled', value: group.info.name.value || 'Group' }; // Indicate success
        } catch (error: any) {
          console.error('Error creating group DOCX:', error);
          return { status: 'rejected', reason: error }; // Indicate failure
        }
      });

      await Promise.allSettled(groupsPromises);

      const notesFolder = projectFolder?.folder('notes') || null;
      const notesPromises = projectData.notes.map(async (note: any) => {
        try {
          const noteContent = generateNoteContent(note);
          const noteDoc = createDocxDocument(noteContent);
          await exportToDocxFile(noteDoc, note.info.title.value || 'Заметка', notesFolder);
          return { status: 'fulfilled', value: note.info.title.value || 'Заметка' }; // Indicate success
        } catch (error: any) {
          console.error('Error creating note DOCX:', error);
          return { status: 'rejected', reason: error }; // Indicate failure
        }
      });
      await Promise.allSettled(notesPromises);

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Save ZIP file
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
  return (
    <>
      <Maket typeSidebar="project" title="ЭКСПОРТ" subtitle={subtitle}>
        <div className="export">
          <Button name="Экспорт в TXT" />
          <Button name="Экспорт в DOCX" onClick={exportToDocx} />
          {/* <Button name="Экспорт в PDF" /> */}
        </div>
      </Maket>
    </>
  );
}
